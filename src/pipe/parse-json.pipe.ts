import { BadRequestException } from '@nestjs/common';
import { Transform, TransformFnParams } from 'class-transformer';

export const ParseJson = function (params?: { isIgnoreIfUndefined?: boolean }) {
  return Transform(
    (transformParams: TransformFnParams) => {
      try {
        if (params?.isIgnoreIfUndefined && !transformParams.value) {
          return undefined;
        }
        const parse = JSON.parse(transformParams.value);
        return parse;
      } catch (error) {
        throw new BadRequestException(`Invalid JSON string at key ${transformParams.key}`);
      }
    },
    { toClassOnly: true },
  );
};
