import { ValidationArguments, ValidationOptions, registerDecorator } from 'class-validator';

export function IsEmptyObject(options?: ValidationOptions) {
  return (object, propertyName: string) => {
    registerDecorator({
      target: object.constructor,
      propertyName,
      options: { ...options, message: `${propertyName} must not be empty object` },
      validator: {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        validate(value: any, validationArguments?: ValidationArguments) {
          const isEmpty = isObjectEmpty(value);
          if (isEmpty) {
            return false;
          }
          return true;
        },
      },
    });
  };
}

const isObjectEmpty = (objectName) => {
  return Object.keys(objectName).length === 0;
};
