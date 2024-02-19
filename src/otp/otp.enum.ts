import { registerEnumType } from '@nestjs/graphql';

export enum OtpUseCase {
  EMAIL_VERIFICATION = 'EMAIL_VERIFICATION',
  PASSWORD_VERIFICATION = 'PASSWORD_VERIFICATION',
}

registerEnumType(OtpUseCase, {
  name: 'OtpUseCase',
});
