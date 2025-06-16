import request from 'supertest';
import { APP_CONFIG } from '../../src/config';
import { app } from '../../src/app';
import { HttpStatus } from '../../src/constants/statuses';
import { CreateInputModel } from '../../src/features/courses/models/CreateInputModel';
import { CourseType } from '../../src/types/courses';
import { UpdateInputModel } from '../../src/features/courses/models/UpdateInputModel';
import { coursesTestManager } from '../utils/coursesTestManager';

describe('Testing courses-API', () => {
  beforeAll(async () => {
    await request(app).delete(APP_CONFIG.PATH.TEST.BASE + APP_CONFIG.PATH.TEST.DB);
  });

  it('returns an array of courses', async () => {
    await request(app).get(APP_CONFIG.PATH.COURSES.BASE).expect(HttpStatus.Ok_200, []);
  });

  it('should return 404 for not existing course', async () => {
    await request(app).get(`${APP_CONFIG.PATH.COURSES.BASE}/10`).expect(HttpStatus.NotFound_404);
  });

  it('should not create course with incorrect input data', async () => {
    const newCourse: CreateInputModel = { title: '' };
    await request(app).post(APP_CONFIG.PATH.COURSES.BASE).send(newCourse).expect(HttpStatus.BadRequest_400);

    await request(app).get(APP_CONFIG.PATH.COURSES.BASE).expect(HttpStatus.Ok_200, []);
  });

  let createdCourse1: CourseType;
  it('should create course with correct input data', async () => {
    const newCourse: CreateInputModel = { title: 'it-incubator course' };
    const { createdEntity } = await coursesTestManager.createCourse(newCourse)

    createdCourse1 = createdEntity;

    await request(app).get(APP_CONFIG.PATH.COURSES.BASE).expect(HttpStatus.Ok_200, [createdCourse1]);
  });

  it('should not  update course with incorrect input data', async () => {
    const updatedCourseTitle: UpdateInputModel = { title: '' };
    await request(app)
      .put(`${APP_CONFIG.PATH.COURSES.BASE}/${createdCourse1.id}`)
      .send(updatedCourseTitle)
      .expect(HttpStatus.BadRequest_400);

    await request(app)
      .get(`${APP_CONFIG.PATH.COURSES.BASE}/${createdCourse1.id}`)
      .expect(HttpStatus.Ok_200, createdCourse1);
  });

  it('should not  update course that not exists', async () => {
    const updatedCourseTitle = { title: 'good title' };
    await request(app)
      .put(`${APP_CONFIG.PATH.COURSES.BASE}/incorrectId`)
      .send(updatedCourseTitle)
      .expect(HttpStatus.NotFound_404);
  });

  it('should update course with correct input data', async () => {
    const updatedCourseTitle: UpdateInputModel = { title: 'good new Title' };
    const result = await request(app)
      .put(`${APP_CONFIG.PATH.COURSES.BASE}/${createdCourse1.id}`)
      .send(updatedCourseTitle)
      .expect(HttpStatus.Ok_200);

    createdCourse1 = result.body;

    await request(app)
      .get(`/courses/${createdCourse1.id}`)
      .expect(HttpStatus.Ok_200, {
        ...createdCourse1,
        ...updatedCourseTitle,
      });
  });

  let createdCourse2: CourseType;
  it('should one more course', async () => {
    const title = 'it-incubator course 2';
    const { createdEntity } = await coursesTestManager.createCourse({ title: title })

    createdCourse2 = createdEntity;

    await request(app).get(APP_CONFIG.PATH.COURSES.BASE).expect(HttpStatus.Ok_200, [createdCourse1, createdCourse2]);
  });

  it('should delete both courses', async () => {
    await request(app).delete(`/courses/${createdCourse1.id}`).expect(HttpStatus.NoContent_204);

    await request(app).get(`/courses/${createdCourse1.id}`).expect(HttpStatus.NotFound_404);

    await request(app).delete(`/courses/${createdCourse2.id}`).expect(HttpStatus.NoContent_204);

    await request(app).get(`/courses/${createdCourse2.id}`).expect(HttpStatus.NotFound_404);

    await request(app).get('/courses').expect(HttpStatus.Ok_200, []);
  });
});
