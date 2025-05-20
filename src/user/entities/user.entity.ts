import { Address } from "src/address/entities/address.entity";
import { Asset } from "src/asset/entities/asset.entity";
import { Department } from "src/department/entities/department.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Exclude } from 'class-transformer';
import { Admin } from "src/admin/entities/admin.entity";

@Entity()
export class User {
    @PrimaryGeneratedColumn('uuid')
    id:string
       
    @Column({unique:false})
    firstname:string

    @Column({nullable:true})
    middlename:string

    @Column()
    lastname:string

    @Column({nullable:true})
    gender:string;

    @Column({nullable:true, unique:true})
    emailaddress:string

    @Column({nullable:true, unique:true})
    phonenumber:string

    @Column({nullable:true, unique:true, select:false, type:'varchar'})
    @Exclude({ toPlainOnly:true })
    password:string;

    @OneToMany(()=> Address, (address) => address.user, {eager:true})
    address: Address[];

    @OneToOne(()=>Department, department=>department.user, {eager:true})
    department: Department;

    @OneToMany(()=> Asset, (asset) => asset.user, {eager:true})
    asset: Asset[];

    @ManyToOne(()=> Admin, (admin)=> admin.user, {eager:false})
    @JoinColumn({name: 'adminId'})
    admin:Admin;
    
    @CreateDateColumn({type: 'timestamptz'})
    createdAt:Date;

    @UpdateDateColumn({type: 'timestamptz'})
    updatedAt: Date;
}
