import { Module, Global } from '@nestjs/common';
import { JwtStrategy } from './jwt.strategy';
import { VietQrJwtStrategy } from './vietqr.strategy';

@Global()
@Module({
  imports: [],
  providers: [JwtStrategy, VietQrJwtStrategy],
  exports: [JwtStrategy, VietQrJwtStrategy],
})
export class JwtAuthModuleGlobal {}
