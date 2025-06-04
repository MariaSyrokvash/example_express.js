import express, { Request, Response } from 'express';
import { TypedRequest, TypedRequestQuery } from './types';
import { Course, CourseBody, CourseParams, CourseQuery } from './types/courses';
import { HttpStatus } from './constants/statuses';

const app = express();
const port = 3000;

app.use(express.json()); // Чтобы Express понимал JSON в теле запроса

const db = {
  courses: [
    { id: 1, title: 'frontend' },
    { id: 2, title: 'backend' },
    { id: 3, title: 'q/a' },
    { id: 4, title: 'devops' },
  ] as Course[],
};

app.get('/courses', (req: TypedRequestQuery<CourseQuery>, res: Response) => {
  const queryTitle = req.query.title || '';
  const filteredCourses = db.courses.filter((c) => c.title.includes(queryTitle));
  res.send(filteredCourses);
});

app.get('/courses/:id', (req: Request, res: Response) => {
  const foundCourses = db.courses.find((c) => c.id === +req.params.id);
  if (!foundCourses) {
    res.sendStatus(HttpStatus.NotFound_404);
    return;
  }
  res.json(foundCourses);
});

app.post('/courses', (req: Request, res: Response) => {
  const bodyTitle = req.body.title?.toString();
  if (!bodyTitle?.length) {
    res.sendStatus(HttpStatus.BadRequest_400);
    return;
  }

  const newCourse = {
    id: +new Date(),
    title: bodyTitle,
  };

  db.courses.push(newCourse);
  res.status(HttpStatus.Created_201).json(newCourse);
});

app.delete('/courses/:id', (req: Request, res: Response) => {
  const courseId = +req.params.id;
  const initialLength = db.courses.length;

  db.courses = db.courses.filter((c) => c.id !== courseId);

  if (db.courses.length === initialLength) {
    res.sendStatus(HttpStatus.NotFound_404);
    return;
  }

  res.sendStatus(HttpStatus.NoContent_204); // Успешно удалено, но без тела
});

app.put('/courses/:id', (req: TypedRequest<CourseParams, CourseBody>, res: Response) => {
  if (!req.body.title) {
    res.sendStatus(400);
    return;
  }
  const foundCourses = db.courses.find((c) => c.id === +req.params.id);
  if (!foundCourses) {
    res.sendStatus(HttpStatus.NotFound_404);
    return;
  }
  foundCourses.title = req.body.title;
  res.status(HttpStatus.Ok_200).json(foundCourses);
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
