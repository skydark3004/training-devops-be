import { ValidationArguments, ValidationOptions, registerDecorator } from 'class-validator';

export function IsImageLink(input?: { options?: ValidationOptions }) {
  return (object, propertyName: string) => {
    registerDecorator({
      target: object.constructor,
      propertyName,
      options: { ...input?.options, message: input?.options?.message || `URL không hợp lệ (không phải ảnh)` },
      validator: {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        validate(value: any, validationArguments?: ValidationArguments) {
          const match = value.match(/^http[^\?]*.(jpg|jpeg|gif|png|tiff|bmp)(\?(.*))?$/gim) != null;
          if (!match) return false;

          return true;
        },
      },
    });
  };
}
