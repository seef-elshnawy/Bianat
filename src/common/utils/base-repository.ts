import { InjectModel } from "@nestjs/sequelize";
import { WhereOptions } from "sequelize";
import { Model , ModelStatic , } from "sequelize-typescript";

export class BaseRepository<T extends Model<T, T>>{
    constructor(
         private model : T
    ){}
    findOne(where:WhereOptions = {} ){
        return this.model.findOne(where)
    }
}