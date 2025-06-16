import { Response, Router } from 'express';
import { db } from '../../db';
import { APP_CONFIG } from '../../config';
import { TypedRequestBody } from '../../types';
import { getViewUserCourseBindingModel } from '../../utils';
import { HttpStatus } from '../../constants/statuses';
import { ViewUserCourseBindingModel } from './models/ViewUserCourseBindingModel';
import { CreateUserCourseBindingModel } from './models/CreateUserCourseBindingModel';
import { UserCourseBindingType } from '../../types/courses';


export const usersCoursesBindingRouter = Router()

usersCoursesBindingRouter.post(APP_CONFIG.PATH.USERS.ROOT, (req: TypedRequestBody<CreateUserCourseBindingModel>, res: Response<ViewUserCourseBindingModel>) => {
  const userId = req.body.userId;
  const courseId = req.body.courseId;

  const user = db.users.find((u) => u.id === userId);
  const course = db.courses.find((c) => c.id === courseId);

  if (!user || !course) {
    res.sendStatus(HttpStatus.BadRequest_400);
    return;
  }

  const alreadyExistedBinding = db.userCourseBindings.find((b) => b.userId === userId && b.courseId === courseId);

  if (alreadyExistedBinding) {
    res.sendStatus(HttpStatus.BadRequest_400);
    return;
  }

  const newBinding: UserCourseBindingType = {
    userId: user.id,
    courseId: course.id,
    date: new Date(),
  };

  db.userCourseBindings.push(newBinding);

  const mappedNewUser = getViewUserCourseBindingModel(newBinding, user, course);
  res.status(HttpStatus.Created_201).json(mappedNewUser);
});
