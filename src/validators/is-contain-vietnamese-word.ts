import { ValidationArguments, ValidationOptions, registerDecorator } from 'class-validator';

export function IsContainVietnameseWords(options?: ValidationOptions) {
  return (object, propertyName: string) => {
    registerDecorator({
      target: object.constructor,
      propertyName,
      options: { ...options, message: `${propertyName} must not contain Vietnamese words` },
      validator: {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        validate(value: any, validationArguments?: ValidationArguments) {
          const regexVietnameseWord = /^[^\u00C0-\u1EF9]+$/i;
          const isHaveVietnameseWord = !regexVietnameseWord.test(value);
          if (isHaveVietnameseWord) return false;
          return true;
        },
      },
    });
  };
}
