import { Admin } from "src/admin/entities/admin.entity";
import { User } from "src/user/entities/user.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";


@Entity()
export class Asset {
    @PrimaryGeneratedColumn('uuid')
    id:string

    @Column()
    deviceName:string

    @Column()
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
