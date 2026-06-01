import { CustomRepository } from "src/database/typeorm-ex.decorator";
import { Repository } from "typeorm";
import { Location } from "./entities/location.entity";

@CustomRepository(Location)
export class LocationRepository extends Repository<Location> {}
