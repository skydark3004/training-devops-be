import { Module } from '@nestjs/common';

import { ModuleService } from './admin/module.service';
import { ModuleController } from './admin/module.controller';
import { ModuleHelper } from './admin/module.helper';

@Module({
  imports: [],
  controllers: [ModuleController],
  providers: [ModuleService, ModuleHelper],
  exports: [ModuleService],
})
export class ModuleModule {}
