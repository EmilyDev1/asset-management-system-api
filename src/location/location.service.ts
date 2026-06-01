import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { LocationRepository } from "./location.repository";
import { CreateLocationDto } from "./dto/create-location.dto";
import { UpdateLocationDto } from "./dto/update-location.dto";

@Injectable()
export class LocationService {
    constructor(
        @InjectRepository(LocationRepository)
        private locationRepo: LocationRepository,
    ) {}

    create(dto: CreateLocationDto) {
        const loc = this.locationRepo.create(dto);
        return this.locationRepo.save(loc);
    }

    async findAll() {
        const locations = await this.locationRepo.find({
            relations: { assets: true },
            order: { createdAt: 'DESC' },
        });
        return locations.map((l) => ({
            id: l.id,
            name: l.name,
            address: l.address,
            city: l.city,
            country: l.country,
            assetCount: l.assets?.length ?? 0,
        }));
    }

    async findOne(id: string) {
        const loc = await this.locationRepo.findOne({
            where: { id },
            relations: { assets: { user: true } },
        });
        if (!loc) throw new NotFoundException('Location not found');
        return loc;
    }

    async update(id: string, dto: UpdateLocationDto) {
        const existing = await this.locationRepo.findOne({ where: { id } });
        if (!existing) throw new NotFoundException('Location not found');
        await this.locationRepo.update(id, dto);
        return this.locationRepo.findOne({ where: { id } });
    }

    async remove(id: string) {
        const existing = await this.locationRepo.findOne({ where: { id } });
        if (!existing) throw new NotFoundException('Location not found');
        await this.locationRepo.delete(id);
        return { id };
    }
}
