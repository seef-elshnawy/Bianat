import { Global, Module } from "@nestjs/common";
import { HelperService } from "./helpers.service";

@Global()
@Module({
    exports : [HelperService],
    providers : [HelperService],
    imports : []
})
export class HelpersModule {}