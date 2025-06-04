import { Request } from 'express';

export type TypedRequest<P = {}, B = {}, Q = {}> = Request<P, {}, B, Q>;

export type TypedRequestQuery<Q> = Request<{}, {}, {}, Q>;
