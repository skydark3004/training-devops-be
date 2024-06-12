import { BadRequestException } from '@nestjs/common';
import { Transform, TransformFnParams } from 'class-transformer';

export const ParseBooleanStringTrueFalse = function (params?: { isIgnoreIfUndefined?: boolean }) {
  return Transform((transformParams: TransformFnParams) => {
    if (params?.isIgnoreIfUndefined && !transformParams.value) {
      return undefined;
    }

    const arr = ['true', 'false', true, false];
    if (!arr.includes(transformParams.value)) {
      throw new BadRequestException(`Invalid ${transformParams.key}. Must be true or false`);
    }
    return JSON.parse(transformParams.value);
  });
};
