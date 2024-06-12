import { ArgumentMetadata, BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
/**
 *  @param classInput
 * là một `class` có các decorator từ `class-validator` \
 * class này phải implement class từ DTO
 ** Pipe này có tác dụng validate body (`exclude validate files`) từ Pipe ở DTO 
 **  với trường hợp pipe ở DTO là pipe dùng để transform  từ json string sang object
 @description
  `Chú ý`: pipe này sẽ chạy 2 lần:
 ** lần 1 với validate file
 ** lần 2 với body data
 */

@Injectable()
export class ValidateBodyFromDTO implements PipeTransform {
  constructor(
    private readonly param: {
      classInput: any;
    },
  ) {}
  async transform(valueFromDTO: any, metadata: ArgumentMetadata) {
    // file sẽ có dạng [Object: null prototype]
    // hoặc
    /*     {
      fieldname: 'avatar',
      originalname: '120kb.jpg',
      encoding: '7bit',
      mimetype: 'image/jpeg',
      buffer: <Buffer ff d8 ff e0 00 10 4a 46 49 46 00 01 01 01 00 48 00 48 00 00 ff db 00 43 00 08 06 06 07 06 05 08 07 07 07 09 09 08 0a 0c 14 0d 0c 0b 0b 0c 19 12 13 0f ... 123507 more bytes>,
      size: 123557
    } */
    // Sử dụng Object.prototype.isPrototypeOf để check xem là file hay body
    // file -> false
    // body -> true

    if (metadata.type === 'body') {
      if (Object.prototype.isPrototypeOf(valueFromDTO) && !valueFromDTO.fieldName && !valueFromDTO.mimetype) {
        const dtoInstance = plainToInstance(this.param.classInput, valueFromDTO);
        const validationErrors = await validate(dtoInstance);
        if (validationErrors.length > 0) {
          /*           const errorMessage = validationErrors[0].children
            .map((error) => {
              return error.constraints ? Object.values(error.constraints) : error;
            })
            .flat(Infinity); */
          const errorMessage = validationErrors[0].constraints ? Object.values(validationErrors[0].constraints) : validationErrors;
          throw new BadRequestException(errorMessage);
        }
      }
    }

    return valueFromDTO;
  }
}
