import express from 'express';
import { APP_CONFIG } from './config';
import { coursesRouter } from './features/courses/courses-router';
import { usersRouter } from './features/users/users-router';
import { testRouter } from './features/test/test-router';
import { usersCoursesBindingRouter } from './features/users-courses-bindings/users-courses-binding-router';


const app = express();

app.use(express.json()); // Чтобы Express понимал JSON в теле запроса

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.use(APP_CONFIG.PATH.COURSES.BASE, coursesRouter)
app.use(APP_CONFIG.PATH.USERS.BASE, usersRouter)
app.use(APP_CONFIG.PATH.USERS_COURSES_BINDING.BASE, usersCoursesBindingRouter)

app.use(APP_CONFIG.PATH.TEST.BASE, testRouter)

export { app };
