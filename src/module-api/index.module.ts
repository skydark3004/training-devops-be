import { Module } from '@nestjs/common';
import { PermissionModule } from './permission/permission.module';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { PackageModule } from './package/package.module';

@Module({
  imports: [PermissionModule, UserModule, AuthModule, PackageModule],
})
export class ModulesApi {}
