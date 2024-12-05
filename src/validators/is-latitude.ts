import { ValidationOptions, registerDecorator } from 'class-validator';

export function IsLatitude(options?: ValidationOptions) {
  return (object: object, propertyName: string) => {
    registerDecorator({
      target: object.constructor,
      propertyName,
      options: { ...options, message: options?.message || 'Latitude is not valid' },
      validator: {
        validate(value: number) {
          // Latitude must be a number between -90 and 90
          return isFinite(value) && Math.abs(value) <= 90;
        },
      },
    });
  };
}
