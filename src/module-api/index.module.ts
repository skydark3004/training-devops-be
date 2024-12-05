import { Module } from '@nestjs/common';
import { PermissionModule } from './permission/permission.module';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { PackageModule } from './package/package.module';
import { ModuleModule } from './module/module.module';
import { ExerciseModule } from './excercise/exercise.module';
import { UploadModule } from './upload/upload.module';
import { LevelModule } from './level/level.module';
import { FaqModule } from './faq/faq.module';
import { LevelSexologyModule } from './level-sexology/level-sexology.module';
import { NutritionModule } from './nutrition/nutrition.module';
import { CategoryModule } from './category/category.module';
import { WelcomeVideoModule } from './welcome-video/welcome-video.module';
import { PracticeProcessModule } from './practice-process/practice-process.module';
import { ExperienceReviewModule } from './experience-review/experience-review.module';
import { ActualPracticeExerciseModule } from './actual-practice-exercise/actual-practice-exercise.module';
import { ActualPracticeDayModule } from './actual-practice-day/actual-practice-day.module';
import { LevelOfCustomerModule } from './level-of-customer/level-of-customer.module';
import { LevelSexologyOfCustomerModule } from './level-sexology-of-customer/level-sexology-of-customer.module';
import { ActualPracticeSexologyExerciseModule } from './actual-practice-sexology-exercise/actual-practice-sexology-exercise.module';
import { CustomerModule } from './customer/customer.module';
import { TipModule } from './tip/tip.module';
import { NotificationModule } from './notification/notification.module';
import { VoucherModule } from './voucher/voucher.module';
import { PurchaseModule } from './purchase/purchase.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { ConfigModule } from './config/config.module';

@Module({
  imports: [
    PermissionModule,
    UserModule,
    AuthModule,
    PackageModule,
    ModuleModule,
    ExerciseModule,
    UploadModule,
    LevelModule,
    FaqModule,
    LevelSexologyModule,
    NutritionModule,
    CategoryModule,
    WelcomeVideoModule,
    PracticeProcessModule,
    ExperienceReviewModule,
    ActualPracticeExerciseModule,
    ActualPracticeDayModule,
    LevelOfCustomerModule,
    LevelSexologyOfCustomerModule,
    ActualPracticeSexologyExerciseModule,
    CustomerModule,
    TipModule,
    NotificationModule,
    VoucherModule,
    PurchaseModule,
    DashboardModule,
    ConfigModule,
  ],
})
export class ModulesApi {}
