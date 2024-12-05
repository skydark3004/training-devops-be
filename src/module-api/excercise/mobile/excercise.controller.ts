import { Controller, Get, Param, ParseUUIDPipe } from '@nestjs/common';

import { ExerciseServiceMobile } from './excercise.service';
import { Auth } from 'src/decorators';
import { EnumRoleCode } from 'src/core/enum';

@Controller('/mobile/exercise')
export class ExerciseControllerMobile {
  constructor(private service: ExerciseServiceMobile) {}

  @Get('/:id')
  @Auth({ roles: [EnumRoleCode.CUSTOMER] })
  async getById(@Param('id', ParseUUIDPipe) id: string) {
    const res = await this.service.getById(id);
    return res;
  }
}
