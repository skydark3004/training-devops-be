import { BadRequestException } from '@nestjs/common';
import { Transform, TransformFnParams } from 'class-transformer';

export const ParseDate = function (obj?: { isIgnoreIfUndefined?: boolean }) {
  return Transform((transformParams: TransformFnParams) => {
    if (obj?.isIgnoreIfUndefined) {
      if (transformParams.value === 'null') return null;
      if (!transformParams.value) return undefined;
    }

    const parse: any = new Date(transformParams.value);
    if (parse == 'Invalid Date') {
      // only use ==
      // not use ===
      throw new BadRequestException(`Invalid Date at key ${transformParams.key}`);
    }
    return parse;
  });
};
