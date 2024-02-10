import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
@Injectable()
export class HelperService {
  async encrypt(text: string, salt: number = 12) {
    return bcrypt.hash(text, salt);
  }

  async compare(origin: string, hashed: string) {
    return bcrypt.compare(origin, hashed);
  }

  enumColumn<T>(enumValue: T) {
    return Object.values(enumValue);
  }
  
}
