import { Module } from '@nestjs/common';

import { CustomerServiceAdmin } from './admin/customer.service';
import { CustomerControllerAdmin } from './admin/customer.controller';
import { CustomerHelper } from './customer.helper';

@Module({
  imports: [],
  controllers: [CustomerControllerAdmin],
  providers: [CustomerServiceAdmin, CustomerHelper],
  exports: [CustomerServiceAdmin],
})
export class CustomerModule {}
