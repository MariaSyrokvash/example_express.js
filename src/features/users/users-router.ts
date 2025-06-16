import { Response, Router } from 'express';
import { db } from '../../db';
import { APP_CONFIG } from '../../config';
import { TypedRequestBody, TypedRequestParams, TypedRequestParamsBody, TypedRequestQuery } from '../../types';
import { getViewUserModel } from '../../utils';
import { HttpStatus } from '../../constants/statuses';
import { QueryUsersModel } from './models/QueryUserModel';
import { ViewUserModel } from './models/ViewUserModel';
import { URIParamsUserModel } from './models/URIParamsUserModel';
import { CreateUserModel } from './models/CreateUserModel';
import { UpdateUserModel } from './models/UpdateUserModel';


export const usersRouter = Router()

usersRouter.get(APP_CONFIG.PATH.ROOT, (req: TypedRequestQuery<QueryUsersModel>, res: Response<ViewUserModel[]>) => {
  const queryUserName = req.query.userName || '';
  const filteredUsers = db.users.filter((c) => c.userName.includes(queryUserName));
  const mappedUser: ViewUserModel[] = filteredUsers.map(getViewUserModel);
  res.send(mappedUser);
});

usersRouter.get(APP_CONFIG.PATH.USERS.BY_ID, (req: TypedRequestParams<URIParamsUserModel>, res: Response<ViewUserModel>) => {
    const foundUser = db.users.find((u) => u.id === +req.params.id);
    if (!foundUser) {
      res.sendStatus(HttpStatus.NotFound_404);
      return;
    }

    const mappedUser = getViewUserModel(foundUser);
    res.json(mappedUser);
  });

usersRouter.post(APP_CONFIG.PATH.ROOT, (req: TypedRequestBody<CreateUserModel>, res: Response<ViewUserModel>) => {
  const bodyUserName = req.body.userName?.toString();
  if (!bodyUserName?.length) {
    res.sendStatus(HttpStatus.BadRequest_400);
    return;
  }

  const newUser = {
    id: +new Date(),
    userName: bodyUserName,
  };

  db.users.push(newUser);

  const mappedNewUser = getViewUserModel(newUser);
  res.status(HttpStatus.Created_201).json(mappedNewUser);
});

usersRouter.delete(APP_CONFIG.PATH.USERS.BY_ID, (req: TypedRequestParams<URIParamsUserModel>, res: Response) => {
  const userId = +req.params.id;
  const initialLength = db.users.length;

  db.users = db.users.filter((c) => c.id !== userId);

  if (db.users.length === initialLength) {
    res.sendStatus(HttpStatus.NotFound_404);
    return;
  }

  res.sendStatus(HttpStatus.NoContent_204); // Успешно удалено, но без тела
});

usersRouter.put(APP_CONFIG.PATH.USERS.BY_ID,
  (req: TypedRequestParamsBody<URIParamsUserModel, UpdateUserModel>, res: Response<ViewUserModel>) => {
    if (!req.body.userName) {
      res.sendStatus(HttpStatus.BadRequest_400);
      return;
    }
    const foundUser = db.users.find((c) => c.id === +req.params.id);
    if (!foundUser) {
      res.sendStatus(HttpStatus.NotFound_404);
      return;
    }
    foundUser.userName = req.body.userName;

    const mappedFoundUser = getViewUserModel(foundUser);

    res.status(HttpStatus.Ok_200).json(mappedFoundUser);
  }
);
