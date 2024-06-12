import { BadRequestException } from '@nestjs/common';
import { ValidationArguments, ValidationOptions, registerDecorator } from 'class-validator';
import { compareBetweenTwoDates } from 'src/libs/utils';

export function ValidateStartEndDate(input: { options?: ValidationOptions; fieldStart: string; fieldEnd: string; isCanBeEqual?: boolean }) {
  return (object, propertyName: string) => {
    registerDecorator({
      target: object.constructor,
      propertyName,
      options: { ...input?.options, message: input?.options?.message || `Ngày bắt đầu phải nhỏ hơn ngày kết thúc` },
      validator: {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        validate(value: any, validationArguments?: ValidationArguments) {
          const startDate = validationArguments.object[input.fieldStart];
          const endDate = validationArguments.object[input.fieldEnd];

          const typeOfCompare = input.isCanBeEqual ? '<=' : '<';

          if (!compareBetweenTwoDates(startDate, typeOfCompare, endDate)) {
            throw new BadRequestException(`Ngày bắt đầu phải nhỏ hơn ${input.isCanBeEqual ? 'hoặc bằng' : ''} ngày kết thúc`);
          }

          return true;
        },
      },
    });
  };
}
