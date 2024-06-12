import { DataSource } from 'typeorm';
import { Inject, Injectable } from '@nestjs/common';
import { CommonRepository } from 'src/libs/typeorm/common.repository';
import { ProvideOfProvidersEnum } from 'src/core/enum';
import { User } from 'src/core/entity/user.entity';

@Injectable()
export class UserRepository extends CommonRepository<User> {
  constructor(
    @Inject(ProvideOfProvidersEnum.DATA_SOURCE)
    private dataSource: DataSource,
  ) {
    super(User, dataSource);
  }
}
