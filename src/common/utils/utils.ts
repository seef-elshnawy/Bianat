import { DataType } from "sequelize-typescript";

export function enumColumn<T extends Record<string , string>>(enumValue: T) {
  return DataType.ENUM(...Object.values(enumValue));
}
