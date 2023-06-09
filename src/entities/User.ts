import { Column, Entity, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { AppUserSession } from "./AppUserSession";
import { CardRequest } from "./CardRequest";
import { PassCard } from "./PassCard";
import { TransactionOperation } from "./TransactionOperation";

@Entity()
export class User {

    @PrimaryGeneratedColumn()
    id!: number;

    @Column('varchar', { default: "" })
    firstName!: string;

    @Column('varchar', { default: '' })
    lastName!: string;

    @Column('varchar', { default: '' })
    phoneNumber!: string

    @Column('text', { default: '' })
    passwordHash!: string

    @Column('text', { default: '' })
    extraSecret!: string;

    @Column('double', { default: 0.0 })
    accountBalance!: number;

    @Column('double', { default: 0 })
    registrationDate!: number

    @Column('text', { default: '' })
    address!: string;

    @Column('bool', { default: false })
    accountActivated = false

    @Column('double', { default: 0 })
    lastAccessDate!: number;

    @OneToOne(() => PassCard, pc => pc.cardOwner, { cascade: true })
    userCard!: PassCard

    @OneToMany(() => TransactionOperation, t => t.transactionActor)
    userTransactions!: TransactionOperation[]

    @OneToOne(() => AppUserSession, s => s.user, { cascade: true })
    session!: AppUserSession

    @OneToOne(() => CardRequest, t => t.requestMaker, { cascade: true })
    cardRequest!: CardRequest
}