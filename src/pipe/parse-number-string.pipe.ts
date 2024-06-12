import { BadRequestException } from '@nestjs/common';
import { Transform, TransformFnParams } from 'class-transformer';

export const ParseNumberString = function (params?: { isIgnoreIfUndefined?: boolean }) {
  return Transform((transformParams: TransformFnParams) => {
    if (params?.isIgnoreIfUndefined && !transformParams.value) {
      return undefined;
    }
    try {
      return JSON.parse(transformParams.value);
    } catch (error) {
      throw new BadRequestException(`Invalid ${transformParams.key}. Not a number string`);
    }
  });
};
