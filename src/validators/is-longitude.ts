import { ValidationOptions, registerDecorator } from 'class-validator';

export function IsLongitude(options?: ValidationOptions) {
  return (object: object, propertyName: string) => {
    registerDecorator({
      target: object.constructor,
      propertyName,
      options: { ...options, message: options?.message || 'Longitude is not valid' },
      validator: {
        validate(value: number) {
          // Longitude must a number between -180 and 180
          return isFinite(value) && Math.abs(value) <= 180;
        },
      },
    });
  };
}
