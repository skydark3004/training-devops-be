import { Body, Controller, Get, Param, ParseUUIDPipe, Post } from '@nestjs/common';

import { ActualPracticeSexologyExerciseServiceMobile } from './actual-practice-sexology-exercise.service';
import { Auth, CurrentUser } from 'src/decorators';
import { EnumRoleCode } from 'src/core/enum';
import { ICurrentUser } from 'src/core/interfaces/current-user.interface';
import { CompleteExerciseDto } from './dto/complete-exercise.dto';

@Controller('/mobile/actual-practice-sexology-exercise')
export class ActualPracticeSexologyExerciseControllerMobile {
  constructor(private service: ActualPracticeSexologyExerciseServiceMobile) {}

  @Get('/:id/preview')
  @Auth({ roles: [EnumRoleCode.CUSTOMER] })
  async getPreviewById(@Param('id', ParseUUIDPipe) id: string, @CurrentUser() currentUser: ICurrentUser) {
    const res = await this.service.getPreviewById(id, currentUser.userId);
    return res;
  }

  @Post('/:id/complete')
  @Auth({ roles: [EnumRoleCode.CUSTOMER] })
  async completeById(@Param('id', ParseUUIDPipe) id: string, @Body() body: CompleteExerciseDto, @CurrentUser('userId') userId: string) {
    const res = await this.service.completeById(id, body, userId);
    return res;
  }
}
