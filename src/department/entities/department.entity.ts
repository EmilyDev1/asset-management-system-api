import { User } from "src/user/entities/user.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class Department {
    @PrimaryGeneratedColumn('uuid')
    id:string;

    @Column()
    department:string;

    @OneToOne(()=>User, user=> user.id)
    @JoinColumn({name: 'userId'})
    user:User;

    @CreateDateColumn({type:'timestamptz'})
    createdAt: Date;

    @UpdateDateColumn({type: 'timestamptz'})
    updatedAt: Date;
}
