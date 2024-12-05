import { EnumPermission, EnumRoleCode } from '../enum';
import { EnumTokenType } from '../enum/type.enum';

export interface ICurrentUser {
  username: string;
  userId: string;
  roleCode?: EnumRoleCode;
  accountGroupId?: string;
  iat?: number;
  exp?: number;
  accountGroup?: any;
  type: EnumTokenType;
  expiredAt?: Date;
  permissionList?: EnumPermission[];
}
