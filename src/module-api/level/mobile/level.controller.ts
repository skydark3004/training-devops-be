import { Body, Controller, Get, HttpCode, HttpStatus, Param, ParseUUIDPipe, Post } from '@nestjs/common';
import { LevelServiceMobile } from './level.service';
import { Auth, CurrentUser } from 'src/decorators';
import { EnumRoleCode } from 'src/core/enum';
import { ICurrentUser } from 'src/core/interfaces/current-user.interface';
import { PreviewLevelDto } from './dto';

@Controller('/mobile/level')
export class LevelControllerMobile {
  constructor(private service: LevelServiceMobile) {}

  @Get('/list')
  @Auth({ roles: [EnumRoleCode.CUSTOMER] })
  async getList(@CurrentUser('userId') userId: string) {
    const res = await this.service.getList(userId);
    return res;
  }

  /* Show tiến độ hoàn thành bài tập theo level đó */
  /*   @Get('/:id/get-my-progress-exercises')
  @Auth({ roles: [EnumRoleCode.CUSTOMER] })
  async getProgressExercisesByLevelId(@Param('id', ParseUUIDPipe) id: string, @CurrentUser('userId') userId: string) {
    const res = await this.service.getProgressExercisesByLevelId(id, userId);
    return res;
  } */

  @Post('/:id/get-preview')
  @HttpCode(200)
  @Auth({ roles: [EnumRoleCode.CUSTOMER] })
  async getPreview(@Param('id', ParseUUIDPipe) id: string, @Body() body: PreviewLevelDto) {
    const res = await this.service.getPreview(id, body);
    return res;
  }

  @Post('/:id/start-learning')
  @Auth({ roles: [EnumRoleCode.CUSTOMER] })
  async startLearning(@Param('id', ParseUUIDPipe) id: string, @CurrentUser() currentUser: ICurrentUser) {
    const res = await this.service.startLearning(id, currentUser.userId);
    return res;
  }
}
