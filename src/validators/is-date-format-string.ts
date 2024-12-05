/* eslint-disable @typescript-eslint/ban-types */
import { registerDecorator, ValidationOptions, ValidatorConstraint, ValidatorConstraintInterface, ValidationArguments } from 'class-validator';

// Custom validator để kiểm tra định dạng ngày 'YYYY/MM-DD'
@ValidatorConstraint({ async: false })
class IsDateFormatConstraint implements ValidatorConstraintInterface {
  validate(date: any, args: ValidationArguments) {
    // Kiểm tra nếu date là chuỗi và khớp với định dạng YYYY/MM/DD
    const dateRegex = /^\d{4}\/\d{2}\/\d{2}$/;
    if (typeof date !== 'string' || !dateRegex.test(date)) {
      return false;
    }

    // Tạo Date từ chuỗi để kiểm tra tính hợp lệ
    const [year, month, day] = date.split('/');
    const parsedDate = new Date(`${year}-${month}-${day}`);

    // Kiểm tra nếu ngày hợp lệ
    return !isNaN(parsedDate.getTime());
  }

  defaultMessage(args: ValidationArguments) {
    return 'Ngày không hợp lệ hoặc không đúng định dạng YYYY/MM-DD';
  }
}

// Decorator để sử dụng custom validator
export function IsDateFormatString(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsDateFormatConstraint,
    });
  };
}
