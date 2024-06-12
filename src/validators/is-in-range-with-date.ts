import { BadRequestException } from '@nestjs/common';
import { ValidationArguments, ValidationOptions, registerDecorator } from 'class-validator';
import moment from 'moment';
import { isInRangeWithEqualWithDate } from 'src/libs/utils';

// 4 trường hợp:
// 1. [2024-09-01T00:00:00.000Z]
// 2. [{date: 2024-09-01T00:00:00.000Z}]
// 3. 2024-09-01T00:00:00.000Z
// 4. {date: 2024-09-01T00:00:00.000Z}

export function IsInRangeWithDate(input: { options?: ValidationOptions; fieldStart: string; fieldEnd: string; fieldOfDateInChildClass?: string }) {
  return (object, propertyName: string) => {
    registerDecorator({
      target: object.constructor,
      propertyName,
      options: { ...input?.options, message: input?.options?.message || `Không nằm trong khoảng ngày bắt đầu và kết thúc` },
      validator: {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        validate(value: any, validationArguments?: ValidationArguments) {
          const startDate: Date = validationArguments.object[input.fieldStart];
          const endDate: Date = validationArguments.object[input.fieldEnd];

          if (value instanceof Array) {
            for (const el of value) {
              const valueInObject = input?.fieldOfDateInChildClass ? el[input.fieldOfDateInChildClass] : el;
              if (!isInRangeWithEqualWithDate({ date: valueInObject, start: startDate, end: endDate })) {
                throw new BadRequestException(`Ngày ${moment(valueInObject).format('DD/MM/YYYY')} không nằm trong ngày bắt đầu và kết thúc`);
              }
            }
          } else {
            const valueInObject = input?.fieldOfDateInChildClass ? value[input.fieldOfDateInChildClass] : value;
            if (!isInRangeWithEqualWithDate({ date: valueInObject, start: startDate, end: endDate })) {
              throw new BadRequestException(`Ngày ${moment(valueInObject).format('DD/MM/YYYY')} không nằm trong ngày bắt đầu và kết thúc`);
            }
          }

          return true;
        },
      },
    });
  };
}
