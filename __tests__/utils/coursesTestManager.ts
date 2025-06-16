import request from 'supertest';
import { app } from '../../src/app';
import { APP_CONFIG } from '../../src/config';
import { HttpStatus } from '../../src/constants/statuses';
import { CreateInputModel } from '../../src/features/courses/models/CreateInputModel';


export const coursesTestManager = {
  async createCourse(newCourse: CreateInputModel, expectedStatusCode: HttpStatus = HttpStatus.Created_201) {
    const response = await request(app)
      .post(APP_CONFIG.PATH.COURSES.BASE)
      .send(newCourse)
      .expect(expectedStatusCode);

    let createdEntity = null;
    if (expectedStatusCode === HttpStatus.Created_201) {
       createdEntity = response.body;

      expect(createdEntity)
        .toEqual({
          id: expect.any(Number),
          title: newCourse.title,
        });
    }


    return {
      response,
      createdEntity
    };
  }
}
