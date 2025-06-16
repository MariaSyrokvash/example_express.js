import { config } from 'dotenv';
config(); // добавление переменных из файла .env в process.env

export const APP_CONFIG = {
  PORT: process.env.PORT || 5000,
  PATH: {
    COURSES: {
      ROOT: '/',
      BASE: '/courses',
      BY_ID: '/:id',
    },
    USERS: {
      ROOT: '/',
      BASE: '/users',
      BY_ID: '/:id',
    },
    USERS_COURSES_BINDING: {
      BASE: '/users-courses-bindings',
    },
    TEST: {
      BASE:  '/__test__',
      DB:  '/db'
    }
  },
};
