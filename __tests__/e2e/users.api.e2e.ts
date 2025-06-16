import request from 'supertest';
import { APP_CONFIG } from '../../src/config';
import { app } from '../../src/app';
import { HttpStatus } from '../../src/constants/statuses';
import { CreateUserModel } from '../../src/features/users/models/CreateUserModel';
import { UserType } from '../../src/types/courses';
import { usersTestManager } from '../utils/usersTestManager';
import { UpdateUserModel } from '../../src/features/users/models/UpdateUserModel';


describe('Testing users-API', () => {
  beforeAll(async () => {
    await request(app)
      .delete(APP_CONFIG.PATH.TEST.BASE + APP_CONFIG.PATH.TEST.DB);
  });

  it('returns an array of users', async () => {
    await request(app)
      .get(APP_CONFIG.PATH.USERS.BASE)
      .expect(HttpStatus.Ok_200, []);
  });

  it('should return 404 for not existing user', async () => {
    await request(app)
      .get(`${APP_CONFIG.PATH.USERS.BASE}/10`)
      .expect(HttpStatus.NotFound_404);
  });

  it('should not create user with incorrect input data', async () => {
    const newUser: CreateUserModel = { userName: '' };

    await usersTestManager.createUser(newUser, HttpStatus.BadRequest_400);

    await request(app)
      .get(APP_CONFIG.PATH.USERS.BASE)
      .expect(HttpStatus.Ok_200, []);
  });

  let createdUser1: UserType;
  it('should create user with correct input data', async () => {
    const newUser: CreateUserModel = { userName: 'Masha' };
    const { createdEntity} = await usersTestManager.createUser(newUser)

    createdUser1 = createdEntity;

    await request(app)
      .get(APP_CONFIG.PATH.USERS.BASE)
      .expect(HttpStatus.Ok_200, [createdUser1]);
  });

  it('should not  update user with incorrect input data', async () => {
    const updatedUserName: UpdateUserModel = { userName: '' };
    await request(app)
      .put(`${APP_CONFIG.PATH.USERS.BASE}/${createdUser1.id}`)
      .send(updatedUserName)
      .expect(HttpStatus.BadRequest_400);

    await request(app)
      .get(`${APP_CONFIG.PATH.USERS.BASE}/${createdUser1.id}`)
      .expect(HttpStatus.Ok_200, createdUser1);
  });

  it('should not update user that not exists', async () => {
    const updatedUserName = { userName: 'Maria' };
    await request(app)
      .put(`${APP_CONFIG.PATH.USERS.BASE}/incorrectId`)
      .send(updatedUserName)
      .expect(HttpStatus.NotFound_404);
  });

  it('should update user with correct input data', async () => {
    const updatedUserName: UpdateUserModel = { userName: 'good new UserName' };
    const result = await request(app)
      .put(`${APP_CONFIG.PATH.USERS.BASE}/${createdUser1.id}`)
      .send(updatedUserName)
      .expect(HttpStatus.Ok_200);

    createdUser1 = result.body;

    await request(app)
      .get(`${APP_CONFIG.PATH.USERS.BASE}/${createdUser1.id}`)
      .expect(HttpStatus.Ok_200, {
        ...createdUser1,
        ...updatedUserName,
      });
  });

  let createdUser2: UserType;
  it('should one more user', async () => {
    const userName = 'Andrei';
    const { createdEntity } = await usersTestManager.createUser({ userName: userName })

    createdUser2 = createdEntity;

    await request(app)
      .get(APP_CONFIG.PATH.USERS.BASE)
      .expect(HttpStatus.Ok_200, [createdUser1, createdUser2]);
  });

  it('should delete both users', async () => {
    await request(app).delete(`${APP_CONFIG.PATH.USERS.BASE}/${createdUser1.id}`).expect(HttpStatus.NoContent_204);

    await request(app).get(`${APP_CONFIG.PATH.USERS.BASE}/${createdUser1.id}`).expect(HttpStatus.NotFound_404);

    await request(app).delete(`${APP_CONFIG.PATH.USERS.BASE}/${createdUser2.id}`).expect(HttpStatus.NoContent_204);

    await request(app).get(`${APP_CONFIG.PATH.USERS.BASE}/${createdUser2.id}`).expect(HttpStatus.NotFound_404);

    await request(app).get(APP_CONFIG.PATH.USERS.BASE).expect(HttpStatus.Ok_200, []);
  });
});
