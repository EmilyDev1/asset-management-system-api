import { Module } from "@nestjs/common";
import { TypeOrmModule } from "src/database/typeorm-ex.module";
import { AssetRepository } from "src/asset/asset.repository";
import { LocationRepository } from "src/location/location.repository";
import { UserRepository } from "src/user/user.repository";
import { DashboardController } from "./dashboard.controller";
import { DashboardService } from "./dashboard.service";

@Module({
    imports: [
        TypeOrmModule.forCustomRepository([
            AssetRepository,
            LocationRepository,
            UserRepository,
        ]),
    ],
    controllers: [DashboardController],
    providers: [DashboardService],
})
export class DashboardModule {}
