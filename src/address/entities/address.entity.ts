import { User } from "src/user/entities/user.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class Address {
    @PrimaryGeneratedColumn('uuid')
    id:string

    @Column()
    address1:string

    @Column()
    address2:string
 
    @Column({nullable: true}) 
    town:string

    @Column({nullable: true})
    province:string

    @Column({nullable: true})
    country:string

    @ManyToOne(()=> User, (User)=> User.address, {eager:false})
    @JoinColumn({name:'userId'})
    user:User;

    @CreateDateColumn({type: 'timestamptz'})
    createdAt:Date;

    @UpdateDateColumn({type: 'timestamptz'})
    updatedAt:Date;

}
