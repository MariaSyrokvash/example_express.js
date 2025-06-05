import request from "supertest";
import { app } from '../src';
import { HttpStatus } from '../src/constants/statuses';
import { Course } from '../src/types/courses';

describe('/courses', () => {

  beforeAll(async () => {
    await request(app).delete('/__test__/db');
  })

  it('returns an array of courses', async() => {
    await request(app)
      .get('/courses')
      .expect(HttpStatus.Ok_200, []);
  })

  it('should return 404 for not existing course', async() => {
    await request(app)
      .get('/courses/10')
      .expect(HttpStatus.NotFound_404);
  })


  it('should not  create course with incorrect input data', async() => {
    await request(app)
      .post('/courses')
      .send({ title: '' })
      .expect(HttpStatus.BadRequest_400)


    await request(app)
      .get('/courses')
      .expect(HttpStatus.Ok_200, []);
  })

  let createdCourse1: Course;
  it('should  create course with correct input data', async() => {
    const createdResponse = await request(app)
      .post('/courses')
      .send({ title: 'it-incubator course' })
      .expect(HttpStatus.Created_201)

    createdCourse1 = createdResponse.body;

    expect(createdCourse1).toEqual({
      id: expect.any(Number),
      title: 'it-incubator course'
    });

    await request(app)
      .get('/courses')
      .expect(HttpStatus.Ok_200, [createdCourse1]);
  })

  it('should not  update course with incorrect input data', async() => {
     await request(app)
      .put(`/courses/${createdCourse1.id}`)
      .send({ title: '' })
      .expect(HttpStatus.BadRequest_400)


    await request(app)
      .get(`/courses/${createdCourse1.id}`)
      .expect(HttpStatus.Ok_200, createdCourse1);
  })


  it('should not  update course that not exists', async() => {
    await request(app)
      .put(`/courses/incorrectId`)
      .send({ title: 'good title' })
      .expect(HttpStatus.NotFound_404)
  })

  it('should update course with correct input data', async() => {
    const newTitle =  'good new Title' ;
    const result = await request(app)
      .put(`/courses/${createdCourse1.id}`)
      .send( { title: newTitle})
      .expect(HttpStatus.Ok_200)


    createdCourse1 = result.body;

    await request(app)
      .get(`/courses/${createdCourse1.id}`)
      .expect(HttpStatus.Ok_200, {
        ...createdCourse1, title: newTitle
      });
  })



  let createdCourse2: Course;
  it('should one more course', async() => {
    const title = 'it-incubator course 2';
    const createdResponse = await request(app)
      .post('/courses')
      .send({ title: title })
      .expect(HttpStatus.Created_201)

    createdCourse2 = createdResponse.body;

    expect(createdCourse2).toEqual({
      id: expect.any(Number),
      title: title
    });

    await request(app)
      .get('/courses')
      .expect(HttpStatus.Ok_200, [createdCourse1, createdCourse2]);
  })


  it('should delete both courses', async() => {
    await request(app)
      .delete(`/courses/${createdCourse1.id}`)
      .expect(HttpStatus.NoContent_204)

    await request(app)
      .get(`/courses/${createdCourse1.id}`)
      .expect(HttpStatus.NotFound_404);

    await request(app)
      .delete(`/courses/${createdCourse2.id}`)
      .expect(HttpStatus.NoContent_204)

    await request(app)
      .get(`/courses/${createdCourse2.id}`)
      .expect(HttpStatus.NotFound_404);

    await request(app)
      .get('/courses')
      .expect(HttpStatus.Ok_200, []);
  })
})
