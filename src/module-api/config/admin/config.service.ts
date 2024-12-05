import { Injectable } from '@nestjs/common';
import { HelperParent } from '../config.helper-parent';
import { TempFileRepository, ConfigRepository } from 'src/module-repository/repository';
import { UpdateGoogleSheetDto } from './dto';
import { EnumConfigCode } from 'src/core/enum';

@Injectable()
export class ConfigServiceAdmin {
  constructor(
    private helperParent: HelperParent,
    private readonly configRepository: ConfigRepository,
    private readonly tempFileRepository: TempFileRepository,
  ) {}

  async getConfigGoogleSheet() {
    const result = await this.configRepository.getSheetInformation();
    console.log()
    return result;
  }

  async updateGoogleSheet(body: UpdateGoogleSheetDto) {
    const result = await this.configRepository.getSheetInformation();

    await this.configRepository.typeOrm.update(
      { code: EnumConfigCode.GOOGLE_SHEET },
      { value: { ...result, eachHourToRunCronJob: body.eachHourToRunCronJob } },
    );

    return { ...result, eachHourToRunCronJob: body.eachHourToRunCronJob };
  }
}
