import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Patch,
    Post,
    UseGuards,
} from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { JwtAuthGuard } from "src/auth/jwt-auth.guard";
import { LocationService } from "./location.service";
import { CreateLocationDto } from "./dto/create-location.dto";
import { UpdateLocationDto } from "./dto/update-location.dto";

@ApiBearerAuth()
@ApiTags('Location')
@Controller('location')
export class LocationController {
    constructor(private readonly locationService: LocationService) {}

    @Post()
    @UseGuards(JwtAuthGuard)
    create(@Body() dto: CreateLocationDto) {
        return this.locationService.create(dto);
    }

    @Get()
    @UseGuards(JwtAuthGuard)
    findAll() {
        return this.locationService.findAll();
    }

    @Get(':id')
    @UseGuards(JwtAuthGuard)
    findOne(@Param('id') id: string) {
        return this.locationService.findOne(id);
    }

    @Patch(':id')
    @UseGuards(JwtAuthGuard)
    update(@Param('id') id: string, @Body() dto: UpdateLocationDto) {
        return this.locationService.update(id, dto);
    }

    @Delete(':id')
    @UseGuards(JwtAuthGuard)
    remove(@Param('id') id: string) {
        return this.locationService.remove(id);
    }
}
