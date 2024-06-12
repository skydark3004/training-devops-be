import { Module } from '@nestjs/common';
import { EmailModuleGlobal } from './email/email.module';

@Module({
  imports: [EmailModuleGlobal],
})
export class ModulesGlobal {}
