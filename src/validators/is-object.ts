import { ValidationArguments, ValidationOptions, registerDecorator } from 'class-validator';

export function IsObject(input?: { options?: ValidationOptions; fieldOfChildClass?: string }) {
  return (object, propertyName: string) => {
    registerDecorator({
      target: object.constructor,
      propertyName,
      options: { ...input?.options, message: `${propertyName} is not an object` },
      validator: {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        validate(value: any, validationArguments?: ValidationArguments) {
          if (value instanceof Array) {
            for (const el of value) {
              const valueToValidate = input?.fieldOfChildClass ? el[input.fieldOfChildClass] : el;
              if (!isObject(valueToValidate)) {
                return false;
              }
            }
          } else {
            const valueToValidate = input?.fieldOfChildClass ? value[input.fieldOfChildClass] : value;
            if (!isObject(valueToValidate)) {
              return false;
            }
          }

          return true;
        },
      },
    });
  };
}

function isObject(value: any) {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}
