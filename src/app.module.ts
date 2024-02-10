import { Module } from '@nestjs/common';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { GraphQLModule } from '@nestjs/graphql';
import { UserModule } from './user/user.module';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from './user/entity/user.entity';
import { HelpersModule } from './common/utils/herlpers.modules';
import { OTP } from './otp/model/otp.model';
import { MailModule } from './mail/mail.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { OtpModule } from './otp/otp.module';

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: true,
      playground: {
        settings: {
          'request.credentials': 'include',
        },
      },
      context: ({ req }) => ({ req }),
    }),
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    SequelizeModule.forRoot({
      dialect: 'postgres',
      models: [User, OTP],
      autoLoadModels: true,
      synchronize: true,
      username: 'postgres',
      password: '12345678',
      database: 'test',
      host: 'localhost',
      port: 5432,
    }),
    UserModule,
    HelpersModule,
    MailModule,
    AuthModule,
    OtpModule,
  ],
})
export class AppModule {}
