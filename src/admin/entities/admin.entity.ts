import { Exclude } from "class-transformer";
import { CreateAddressDto } from "src/address/dto/create-address.dto";
import { Asset } from "src/asset/entities/asset.entity";
import { User } from "src/user/entities/user.entity";
import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

export enum Status{
    ACTIVE="ACTIVE",
    INACTIVE="INACTIVE",
}

@Entity()
export class Admin {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({default: null})
    firstname: string;

    @Column({default: null})
    middlename: string;

    @Column({default: null})
    lastname: string;

    @Column({default: null})
    emailaddress: string;

    @Column({default: null})
    username: string;

    @Column({default: null, unique: true, type:'varchar'})
    @Exclude({ toPlainOnly: true})
    password: string;

    @Column({default:false, nullable:true})
    firstTimeLOgin: boolean;

    @Column({ type: String, nullable:true })
    refreshToken: string;

    @Column({default:null})
    refreshTokenExpires:string;

    @Column({type:'enum',enum:Status, default:Status.ACTIVE })
    status:Status;

    @OneToMany(()=> User, (user) => user.admin, {eager:true})
    user: User[];

    @OneToMany(()=> Asset, (asset) => asset.admin, {eager:true})
    asset: Asset[];

    @CreateDateColumn({ type:'timestamptz'})
    createdAt: Date;

    @UpdateDateColumn({ type: 'timestamptz'})
    updatedAt: Date;
}
