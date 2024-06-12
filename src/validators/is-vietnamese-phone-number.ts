import { ValidationArguments, ValidationOptions, registerDecorator } from 'class-validator';

export function IsVietnamesePhoneNumber(options?: ValidationOptions) {
  return (object, propertyName: string) => {
    registerDecorator({
      target: object.constructor,
      propertyName,
      options: { ...options, message: `Số điện thoại không hợp lệ` },
      validator: {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        validate(value: any, validationArguments?: ValidationArguments) {
          const regexPhoneNumberVietnamese = /((09|03|07|08|05)+([0-9]{8})\b)/g;
          if (!regexPhoneNumberVietnamese.test(value)) {
            return false;
          } else return true;
        },
      },
    });
  };
}
