import request from 'supertest';
import { APP_CONFIG } from '../../src/config';
import { app } from '../../src/app';
import {
  CreateUserCourseBindingModel,
} from '../../src/features/users-courses-bindings/models/CreateUserCourseBindingModel';
import { usersCoursesBindingsTestManager } from '../utils/usersCoursesBindingsTestManager';
import { usersTestManager } from '../utils/usersTestManager';
import { coursesTestManager } from '../utils/coursesTestManager';
import { HttpStatus } from '../../src/constants/statuses';


describe('Testing users-courses-bindings-API', () => {
  beforeEach(async () => {
    await request(app)
      .delete(APP_CONFIG.PATH.TEST.BASE + APP_CONFIG.PATH.TEST.DB);
  });


  it('should create user-course binding with correct input data', async () => {
    const { createdEntity: createdUser} = await usersTestManager.createUser({ userName: 'Maria'})
    const { createdEntity: createdCourse} = await coursesTestManager.createCourse({ title: 'Automatic testing' })

    const newBinding: CreateUserCourseBindingModel = {
      userId: createdUser.id,
      courseId: createdCourse.id
    };

    await usersCoursesBindingsTestManager.createBinding(newBinding);
  });


  it("shouldn't create user-course binding because courseBinding is already exists", async () => {
    const { createdEntity: createdUser} = await usersTestManager.createUser({ userName: 'Maria'})
    const { createdEntity: createdCourse} = await coursesTestManager.createCourse({ title: 'Automatic testing' })

    const newBinding: CreateUserCourseBindingModel = {
      userId: createdUser.id,
      courseId: createdCourse.id
    };

    await usersCoursesBindingsTestManager.createBinding(newBinding);


    await usersCoursesBindingsTestManager.createBinding(newBinding, HttpStatus.BadRequest_400);
  });
});
