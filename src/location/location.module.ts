import { Module } from "@nestjs/common";
import { TypeOrmModule } from "src/database/typeorm-ex.module";
import { LocationController } from "./location.controller";
import { LocationService } from "./location.service";
import { LocationRepository } from "./location.repository";

@Module({
    imports: [TypeOrmModule.forCustomRepository([LocationRepository])],
    controllers: [LocationController],
    providers: [LocationService],
    exports: [LocationService],
})
export class LocationModule {}
