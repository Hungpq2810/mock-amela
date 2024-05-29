import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './modules/auth/auth.module';
import { UserModule } from './modules/users/user.module';
import { MailModule } from './modules/mail/mail.module';
import { TimeKeepingModule } from './modules/timekeeping/timekeeping.module';
import { DepartmentModule } from './modules/departments/department.module';
import { JobModule } from './modules/jobs/job.module';
import { ConfigModule } from '@nestjs/config';
import ormConfig from './configs/orm.config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppLoggerMiddleware } from './middlewares/logger.middleware';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
      load: [ormConfig],
    }),
    TypeOrmModule.forRootAsync({
      useFactory: ormConfig,
    }),
    UserModule,
    AuthModule,
    MailModule,
    TimeKeepingModule,
    DepartmentModule,
    JobModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(AppLoggerMiddleware).forRoutes('*');
  }
}
