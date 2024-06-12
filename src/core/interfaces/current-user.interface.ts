import { PermissionEnum, RoleCodeEnum } from '../enum';
import { TokenTypeEnum } from '../enum/type.enum';

export interface ICurrentUser {
  username: string;
  userId: string;
  roleCode?: RoleCodeEnum;
  accountGroupId?: string;
  iat?: number;
  exp?: number;
  accountGroup?: any;
  type: TokenTypeEnum;
  expiredAt?: Date;
  permissionList?: PermissionEnum[];
}
