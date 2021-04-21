import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BusinessException } from '@src/shared/exceptions/business-exception';
import { getManager, Like, Repository } from 'typeorm';
import { userConstants } from './constants';
import { CreateUserDto } from './dto/create-user.dto';
import { UserEntity } from './entities/user.entity';
import { UserRole } from './enum/user-role.enum';

@Injectable()
export class UserService {

    constructor(
        @InjectRepository(UserEntity)
        private userRepository: Repository<UserEntity>) { }

    async create(userDto: CreateUserDto): Promise<UserEntity> {
        // Getting wether there is already an user with this e-mail
        let user = await this.findOneByEmail(userDto.email);
        // if there is throws an business exception
        if (user != null)
            throw new BusinessException('email', userConstants.email.inUse);
        // Creating the user into the system
        const createdUser = getManager().create(UserEntity, userDto);
        createdUser.role = UserRole.LEAD;
        // Returning the user info
        return await createdUser.save();
    }

    async findById(userId: string): Promise<UserEntity> {
        return this.userRepository.findOne(userId);
    }

    async findOneByEmail(email: string): Promise<UserEntity> {
        return this.userRepository.findOne({ where: { email: Like(email) } });
    }

}
