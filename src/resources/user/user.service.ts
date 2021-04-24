import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { BusinessException } from '@src/shared/exceptions/business-exception';
import { MailService } from '@src/shared/modules/mail/mail.service';
import * as moment from 'moment';
import { getManager, Repository } from 'typeorm';
import { userConstants } from './constants';
import { CreateUserDto } from './dto/create-user.dto';
import { UserEntity } from './entities/user.entity';
import { UserRole } from './enum/user-role.enum';

@Injectable()
export class UserService {

    constructor(
        @InjectRepository(UserEntity)
        private userRepository: Repository<UserEntity>,
        private mailService: MailService,
        private config: ConfigService) { }

    async create(userDto: CreateUserDto): Promise<UserEntity> {
        // Getting wether there is already an user with this e-mail
        let user = await this.findOneByEmail(userDto.email);
        // if there is a registered user already throws a business exception
        if (user != null)
            throw new BusinessException('email', userConstants.email.inUse);

        // Creating the user into the system
        const createdUser = getManager().create(UserEntity, userDto);
        createdUser.role = UserRole.LEAD;
        createdUser.verified = false;
        createdUser.verificationCode = this.generateVerificationCode();
        createdUser.verificationCodeValid = this.generateVerificationCodeValidity();

        // Saving on the database
        const userResponse = await createdUser.save();

        // Sending confirmation email without waiting
        this.sendConfirmationEmail(userResponse);

        // Returning the user info
        return userResponse;
    }

    async verify(email: string, code: string) {
        let user = await this.findOneByEmail(email);
        let current = moment(Date.now());
        let verific = moment(user.verificationCodeValid);
        let valid = current.isBefore(verific) && code == user.verificationCode;

        if (valid) {
            user.verified = true;
            user.role = UserRole.CLIENT;
            user.verificationCodeValid = moment().toDate();
            await user.save();
        }

        return valid;
    }

    async resendVerificationCode(email: string) {
        let user = await this.findOneByEmail(email);
        if (user != null) {
            user.verificationCode = this.generateVerificationCode();
            user.verificationCodeValid = this.generateVerificationCodeValidity();
            await user.save();

            // Sending confirmation email without waiting
            this.sendConfirmationEmail(user);
        }
    }

    generateVerificationCode(): string {
        // Generating the verification code
        return Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    }

    generateVerificationCodeValidity(): Date {
        let daysToAdd = this.config.get<string>('VERIFICATION_CODE_VALIDITY');
        return moment(Date.now())
            .add(parseInt(daysToAdd), 'days')
            .endOf('day')
            .toDate();
    }

    async findById(userId: string): Promise<UserEntity> {
        return this.userRepository.findOne(userId);
    }

    async findOneByEmail(email: string): Promise<UserEntity> {
        return this.userRepository.findOne({ where: { email: email?.toLowerCase() } });
    }

    async getBalance(userId: string): Promise<number> {
        const result = await getManager().createQueryBuilder(UserEntity, 'user')
            .where('user.id = :userId', { userId })
            .select('balance')
            .getRawOne();
        return result?.balance;
    }

    private async sendConfirmationEmail(user: UserEntity) {
        // Sending confirmation e-mail
        await this.mailService.mail({
            subject: userConstants.mailSend.subjectCreation,
            template: 'signup',
            to: user.email,
            data: {
                firstName: user.firstName,
                code: user.verificationCode,
            },
        });
    }

}
