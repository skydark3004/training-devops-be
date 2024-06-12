import { ValidationArguments, ValidationOptions, registerDecorator } from 'class-validator';
import moment from 'moment';
import 'moment-timezone';

export function IsThePastDay(options?: ValidationOptions) {
  return (object, propertyName: string) => {
    registerDecorator({
      target: object.constructor,
      propertyName,
      options: { ...options, message: options?.message || `${propertyName} không được là ngày quá khứ` },
      validator: {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        validate(value: any, validationArguments?: ValidationArguments) {
          const isThePast = moment(value).tz('UTC').add(7, 'hours') < moment().tz('UTC').add(7, 'hours').startOf('day');
          if (isThePast) return false;
          return true;
        },
      },
    });
  };
}
