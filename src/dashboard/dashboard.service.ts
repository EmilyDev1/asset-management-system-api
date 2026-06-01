import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { AssetRepository } from "src/asset/asset.repository";
import {
    AssetCategory,
    AssetStatus,
} from "src/asset/entities/asset.entity";
import { LocationRepository } from "src/location/location.repository";
import { UserRepository } from "src/user/user.repository";

@Injectable()
export class DashboardService {
    constructor(
        @InjectRepository(AssetRepository) private assetRepo: AssetRepository,
        @InjectRepository(UserRepository) private userRepo: UserRepository,
        @InjectRepository(LocationRepository) private locationRepo: LocationRepository,
    ) {}

    async getStats() {
        const [total, byStatus, byCategory, byLocation, trend, topEmployees, upcomingMaintenance] =
            await Promise.all([
                this.assetRepo.count(),
                this.countByEnum('status', AssetStatus),
                this.countByEnum('category', AssetCategory),
                this.countByLocation(),
                this.assetTrend(),
                this.topAssignees(),
                this.upcomingMaintenance(),
            ]);

        return {
            total,
            byStatus,
            byCategory,
            byLocation,
            trend,
            topEmployees,
            upcomingMaintenance,
        };
    }

    private async countByEnum<T extends Record<string, string>>(
        column: 'status' | 'category',
        enumDef: T,
    ): Promise<Record<string, number>> {
        const rows = await this.assetRepo
            .createQueryBuilder('a')
            .select(`a.${column}`, 'key')
            .addSelect('COUNT(*)::int', 'count')
            .groupBy(`a.${column}`)
            .getRawMany<{ key: string; count: number }>();

        const counts: Record<string, number> = {};
        Object.values(enumDef).forEach((v) => (counts[v] = 0));
        rows.forEach((r) => (counts[r.key] = r.count));
        return counts;
    }

    private async countByLocation() {
        const rows = await this.assetRepo
            .createQueryBuilder('a')
            .leftJoin('a.location', 'l')
            .select('l.id', 'id')
            .addSelect('l.name', 'name')
            .addSelect('COUNT(a.id)::int', 'count')
            .groupBy('l.id')
            .addGroupBy('l.name')
            .orderBy('count', 'DESC')
            .getRawMany<{ id: string | null; name: string | null; count: number }>();

        return rows.map((r) => ({
            id: r.id,
            name: r.name ?? 'Unassigned',
            count: r.count,
        }));
    }

    private async assetTrend() {
        // Cumulative asset count by month for the last 6 months
        const rows = await this.assetRepo
            .createQueryBuilder('a')
            .select(`to_char(date_trunc('month', a."createdAt"), 'YYYY-MM')`, 'month')
            .addSelect('COUNT(*)::int', 'count')
            .groupBy('month')
            .orderBy('month', 'ASC')
            .getRawMany<{ month: string; count: number }>();

        const months: { month: string; total: number }[] = [];
        const now = new Date();
        let running = 0;

        for (let i = 5; i >= 0; i--) {
            const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
            const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
            const monthLabel = d.toLocaleString('en', { month: 'short' });
            const monthRow = rows.find((r) => r.month === key);
            running += monthRow ? monthRow.count : 0;
            months.push({ month: monthLabel, total: running });
        }

        // Add cumulative count for any months earlier than the window
        const earlierTotal = rows
            .filter((r) => {
                const earliestInWindow = new Date(now.getFullYear(), now.getMonth() - 5, 1);
                const [y, m] = r.month.split('-').map(Number);
                return new Date(y, m - 1, 1) < earliestInWindow;
            })
            .reduce((s, r) => s + r.count, 0);

        return months.map((m) => ({ ...m, total: m.total + earlierTotal }));
    }

    private async topAssignees() {
        const rows = await this.assetRepo
            .createQueryBuilder('a')
            .leftJoin('a.user', 'u')
            .select('u.id', 'id')
            .addSelect('u.firstname', 'firstname')
            .addSelect('u.middlename', 'middlename')
            .addSelect('u.lastname', 'lastname')
            .addSelect('u.emailaddress', 'email')
            .addSelect('COUNT(a.id)::int', 'count')
            .where('u.id IS NOT NULL')
            .groupBy('u.id')
            .orderBy('count', 'DESC')
            .limit(5)
            .getRawMany<{
                id: string;
                firstname: string;
                middlename: string | null;
                lastname: string;
                email: string | null;
                count: number;
            }>();

        return rows.map((r) => ({
            id: r.id,
            name: [r.firstname, r.middlename, r.lastname].filter(Boolean).join(' ').trim(),
            email: r.email,
            count: r.count,
        }));
    }

    private async upcomingMaintenance() {
        const rows = await this.assetRepo
            .createQueryBuilder('a')
            .leftJoinAndSelect('a.location', 'l')
            .where('a.nextMaintenance IS NOT NULL')
            .andWhere('a.nextMaintenance >= CURRENT_DATE')
            .orderBy('a.nextMaintenance', 'ASC')
            .limit(5)
            .getMany();

        return rows.map((a) => ({
            id: a.id,
            name: [a.brand, a.model].filter(Boolean).join(' ') || a.deviceName,
            nextMaintenance: a.nextMaintenance,
            locationName: a.location?.name ?? null,
        }));
    }

}
