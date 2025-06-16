import request from 'supertest';
import { CreateUserModel } from '../../src/features/users/models/CreateUserModel';
import { app } from '../../src/app';
import { APP_CONFIG } from '../../src/config';
import { HttpStatus } from '../../src/constants/statuses';
import {
  CreateUserCourseBindingModel
} from '../../src/features/users-courses-bindings/models/CreateUserCourseBindingModel';


export const usersCoursesBindingsTestManager = {
  async createBinding(newBinding: CreateUserCourseBindingModel, expectedStatusCode: HttpStatus = HttpStatus.Created_201) {
    const response = await request(app)
      .post(APP_CONFIG.PATH.USERS_COURSES_BINDING.BASE)
      .send(newBinding)
      .expect(expectedStatusCode);

    let createdEntity = null;
    if (expectedStatusCode === HttpStatus.Created_201) {
       createdEntity = response.body;

      expect(createdEntity)
        .toEqual({
          userId: newBinding.userId,
          courseId: newBinding.courseId,
          userName: expect.any(String),
          courseTitle: expect.any(String),
        });
    }

    return {
      response,
      createdEntity
    };
  }
}
