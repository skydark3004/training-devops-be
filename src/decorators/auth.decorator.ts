import { applyDecorators, SetMetadata, UseGuards } from '@nestjs/common';
import { EnumMetadata, EnumPermission } from 'src/core/enum';
import { JwtAuthGuard } from 'src/guard/jwt-auth.guard';

export function Auth(params: {
  roles?: string[];
  allowAnonymous?: boolean;
  allowSecret?: boolean;
  onlyPostman?: true;
  permissions?: EnumPermission[];
}) {
  return applyDecorators(
    SetMetadata(EnumMetadata.ROLES, params.roles),
    SetMetadata(EnumMetadata.ALLOW_ANONYMOUS, params.allowAnonymous),
    SetMetadata(EnumMetadata.ALLOW_SECRET, params.allowSecret),
    SetMetadata(EnumMetadata.ONLY_POSTMAN, params.onlyPostman),
    SetMetadata(EnumMetadata.PERMISSIONS, params?.permissions),
    UseGuards(JwtAuthGuard),
  );
}
