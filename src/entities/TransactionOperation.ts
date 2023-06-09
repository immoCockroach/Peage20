import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./User";


@Entity()
export class TransactionOperation {

    @PrimaryGeneratedColumn()
    id!: number

    @Column('varchar', { default: '' })
    transactionID!: string

    @Column('text', { default: '' })
    hash!: string

    @Column('double', { default: 0 })
    initiatedOn!: number

    @Column('double', { default: 0.0 })
    amount!: number

    @ManyToOne(() => User, u => u.userTransactions)
    transactionActor!: User

    @Column('varchar', { default: '' })
    status: 'rejected' | 'pending' | 'success' | 'no-status' = 'no-status'
}