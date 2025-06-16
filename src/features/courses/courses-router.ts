import { Response, Router } from 'express';
import { TypedRequestBody, TypedRequestParams, TypedRequestParamsBody, TypedRequestQuery } from '../../types';
import { APP_CONFIG } from '../../config';
import { QueryInputModel } from './models/QueryInputModel';
import { ViewCourseModel } from './models/ViewCourseModel';
import { db } from '../../db';
import { getViewCourseModel } from '../../utils';
import { URIParamsCourseModel } from './models/URIParamsCourseModel';
import { HttpStatus } from '../../constants/statuses';
import { CreateInputModel } from './models/CreateInputModel';
import { UpdateInputModel } from './models/UpdateInputModel';


export const coursesRouter = Router()

coursesRouter.get(APP_CONFIG.PATH.ROOT, (req: TypedRequestQuery<QueryInputModel>, res: Response<ViewCourseModel[]>) => {
  const queryTitle = req.query.title || '';
  const filteredCourses = db.courses.filter((c) => c.title.includes(queryTitle));
  const mappedCourses: ViewCourseModel[] = filteredCourses.map(getViewCourseModel);
  res.send(mappedCourses);
});

coursesRouter.get(APP_CONFIG.PATH.COURSES.BY_ID, (req: TypedRequestParams<URIParamsCourseModel>, res: Response<ViewCourseModel>) => {
    const foundCourse = db.courses.find((c) => c.id === +req.params.id);
    if (!foundCourse) {
      res.sendStatus(HttpStatus.NotFound_404);
      return;
    }

    const mappedCourse = getViewCourseModel(foundCourse);
    res.json(mappedCourse);
  });

coursesRouter.post(APP_CONFIG.PATH.ROOT, (req: TypedRequestBody<CreateInputModel>, res: Response<ViewCourseModel>) => {
  const bodyTitle = req.body.title?.toString();
  if (!bodyTitle?.length) {
    res.sendStatus(HttpStatus.BadRequest_400);
    return;
  }

  const newCourse = {
    id: +new Date(),
    title: bodyTitle,
    studentsCount: 0,
  };

  db.courses.push(newCourse);

  const mappedNewCourse = getViewCourseModel(newCourse);
  res.status(HttpStatus.Created_201).json(mappedNewCourse);
});

coursesRouter.delete(APP_CONFIG.PATH.COURSES.BY_ID, (req: TypedRequestParams<URIParamsCourseModel>, res: Response) => {
  const courseId = +req.params.id;
  const initialLength = db.courses.length;

  db.courses = db.courses.filter((c) => c.id !== courseId);

  if (db.courses.length === initialLength) {
    res.sendStatus(HttpStatus.NotFound_404);
    return;
  }

  res.sendStatus(HttpStatus.NoContent_204); // Успешно удалено, но без тела
});

coursesRouter.put(APP_CONFIG.PATH.COURSES.BY_ID,
  (req: TypedRequestParamsBody<URIParamsCourseModel, UpdateInputModel>, res: Response<ViewCourseModel>) => {
    if (!req.body.title) {
      res.sendStatus(400);
      return;
    }
    const foundCourse = db.courses.find((c) => c.id === +req.params.id);
    if (!foundCourse) {
      res.sendStatus(HttpStatus.NotFound_404);
      return;
    }
    foundCourse.title = req.body.title;

    const mappedFoundCourse = getViewCourseModel(foundCourse);

    res.status(HttpStatus.Ok_200).json(mappedFoundCourse);
  }
);
