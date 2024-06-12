import { ExecutionContext, createParamDecorator } from '@nestjs/common';

/**
 * @description
 * Decorator giúp lấy ra req.user từ request
 */

export const CurrentUser = createParamDecorator((property: string | string[], ectx: ExecutionContext) => {
  const ctx = ectx.getArgByIndex(1);
  if (property && Array.isArray(property)) {
    const obj: any = {};
    for (const el of property) {
      obj[el] = ctx.req?.user[el];
    }
    return obj;
  }

  if (property && !Array.isArray(property)) {
    return ctx.req?.user[property];
  }

  return ctx.req?.user;

  //return property ? ctx.req.user && ctx.req.user[property] : ctx.req.user;
});
