import request from 'supertest';
import { CreateUserModel } from '../../src/features/users/models/CreateUserModel';
import { app } from '../../src/app';
import { APP_CONFIG } from '../../src/config';
import { HttpStatus } from '../../src/constants/statuses';


export const usersTestManager = {
  async createUser(newUser: CreateUserModel, expectedStatusCode: HttpStatus = HttpStatus.Created_201) {
    const response = await request(app)
      .post(APP_CONFIG.PATH.USERS.BASE)
      .send(newUser)
      .expect(expectedStatusCode);

    let createdEntity = null;
    if (expectedStatusCode === HttpStatus.Created_201) {
       createdEntity = response.body;

      expect(createdEntity)
        .toEqual({
          id: expect.any(Number),
          userName: newUser.userName,
        });
    }


    return {
      response,
      createdEntity
    };
  }
}
