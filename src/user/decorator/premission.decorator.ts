import { SetMetadata } from '@nestjs/common';

export const PoliticKey = 'politicsKeUniqukey';
export const checkPolitics = (...premissons: Array<String>) =>
  SetMetadata(PoliticKey, premissons);
