import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BusinessException } from '@src/shared/exceptions/business-exception';
import { getConnection, Repository } from 'typeorm';
import { UserEntity } from '../user/entities/user.entity';
import { UserService } from '../user/user.service';
import { transactionConstants } from './constants';
import { TransactionEntity } from './entities/transaction.entity';

@Injectable()
export class TransactionService {

    constructor(
        @InjectRepository(TransactionEntity)
        private _transactionRepository: Repository<TransactionEntity>,
        private _userService: UserService) { }

    /**
     * Inserts on user history the current amount transaction
     * @param value The amount to be transacted
     * @param user The user that will be affected
     * @returns whether it was able to transact successfully
     */
    async transact(value: number, description: string, user: UserEntity): Promise<boolean> {
        // const newValue = +value;
        // const userBalance = +user.balance;
        // const factor =
        const newBalance = +value + +user.balance;

        // mounting the transaction history
        const transaction = new TransactionEntity();
        transaction.description = description;
        transaction.amount = value;
        transaction.success = true;
        transaction.user = user;

        try {
            // if the balance comes to negative we'll rollback
            // the transaction saving only on the history
            // the attempt of transacting
            if (newBalance < 0)
                throw new BusinessException('balance', transactionConstants.cannotBeNegative);

            user.balance = newBalance;

            // Saving both user and the transaction history
            await getConnection().transaction(async em => {
                await em.save(user);
                await em.save(transaction);
                return true;
            });
            return true;
        } catch (e) {
            // Saving on user's history the failure
            transaction.success = false;
            await transaction.save();
            return false;
        }
    }

}
