import { Admin } from "src/admin/entities/admin.entity";
import { Location } from "src/location/entities/location.entity";
import { User } from "src/user/entities/user.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

export enum AssetStatus {
    IN_USE = 'in_use',
    IN_STORAGE = 'in_storage',
    PENDING = 'pending',
    MAINTENANCE = 'maintenance',
}

export enum AssetCategory {
    LAPTOP = 'laptop',
    DESKTOP = 'desktop',
    MONITOR = 'monitor',
    PERIPHERAL = 'peripheral',
    MOBILE = 'mobile',
    TABLET = 'tablet',
    NETWORKING = 'networking',
    OTHER = 'other',
}

@Entity()
export class Asset {
    @PrimaryGeneratedColumn('uuid')
    id:string

    @Column()
    deviceName:string

    @Column({
        type: 'enum',
        enum: AssetStatus,
        default: AssetStatus.PENDING,
    })
    status: AssetStatus;

    @Column({nullable: true})
    color:string

    @Column({nullable: true})
    brand:string

    @Column({nullable: true})
    model:string

    @Column({nullable: true})
    serialnumber:string

    @Column({nullable: true})
    processor:string

    @Column({nullable: true})
    hdd_ssd_size:string

    @Column({nullable: true})
    ramsize:string

    @Column({nullable: true})
    condition:string

    @Column({
        type: 'enum',
        enum: AssetCategory,
        default: AssetCategory.OTHER,
    })
    category: AssetCategory;

    @Column({ type: 'date', nullable: true })
    nextMaintenance: Date | null;

    @ManyToOne(() => Location, (location) => location.assets, { eager: false, nullable: true, onDelete: 'SET NULL' })
    @JoinColumn({ name: 'locationId' })
    location: Location | null;

    @ManyToOne(()=> User, (User)=> User.asset, {eager:false})
    @JoinColumn({name: 'userId'})
    user:User;

    @ManyToOne(()=> Admin, (admin)=> admin.asset, {eager:false})
    @JoinColumn({name: 'adminId'})
    admin:Admin;

    @CreateDateColumn({type:'timestamptz'})
    createdAt: Date;

    @UpdateDateColumn({type: 'timestamptz'})
    updatedAt: Date;
}
