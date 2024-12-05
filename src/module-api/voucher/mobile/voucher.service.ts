import { BadRequestException, Injectable } from '@nestjs/common';
import { EnumResponseError } from '../voucher.enum';
import { HelperParent } from '../voucher.helper-parent';
import { VoucherRepository } from 'src/module-repository/repository';
import { CheckIsValidDto } from './dto/check-is-valid.dto';

@Injectable()
export class VoucherServiceMobile {
  constructor(
    private helperParent: HelperParent,
    private readonly voucherRepository: VoucherRepository,
  ) {}

  async checkIsValidById(body: CheckIsValidDto) {
    const getById = await this.voucherRepository.findOneByParams({ conditions: { code: body.voucherCode, status: true } });
    if (!getById) throw new BadRequestException(EnumResponseError.VOUCHER_NOT_FOUND);

    if (getById.remainingQuantity === 0) {
      throw new BadRequestException('Mã giảm giá đã có số lượt dùng tối đa');
    }

    return getById;
  }
}
