import { ValidationArguments, ValidationOptions, registerDecorator } from 'class-validator';

export function IsEmptyString(options?: ValidationOptions) {
  return (object, propertyName: string) => {
    registerDecorator({
      target: object.constructor,
      propertyName,
      options: { ...options, message: `${propertyName} không được chỉ có khoảng trắng` },
      validator: {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        validate(value: any, validationArguments?: ValidationArguments) {
          if (typeof value === 'string' && value.trim() == '') {
            return false;
          } else return true;
        },
      },
    });
  };
}
