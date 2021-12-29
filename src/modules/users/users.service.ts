import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { ReturnModelType } from '@typegoose/typegoose';
import { hashPassword } from '@utils/hash.util';
import { uuid_v4 } from '@utils/uuid.util';
import { InjectModel } from 'nestjs-typegoose';
import { CreateUserDto } from './dtos/create-user.dto';
import { User } from './models/user.model';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User) private readonly userModel: ReturnModelType<typeof User>) {}

  async createNewUser(newUser: CreateUserDto) {
    try {
      const userCreated = await this.userModel.create({
        id: uuid_v4(),
        ...newUser,
      });
      return userCreated;
    } catch (err) {
      if (err.name === 'MongoError' && err?.code === 11000) {
        throw new ConflictException('User with that email already exists!');
      }
      throw err;
    }
  }

  async markEmailAsConfirmed(emailAddress: string) {
    return await this.userModel.updateOne(
      { emailAddress },
      {
        isEmailConfirmed: true,
      },
    );
  }

  async hashCurrentRefreshToken(refreshToken: string, id: string) {
    const foundUser = this.findOneById(id);
    try {
      if (!foundUser) {
        throw new NotFoundException('User with this id does not exist');
      }

      const currentHashedRefreshToken = await hashPassword(refreshToken);
      return await this.userModel.updateOne(
        { id },
        {
          currentHashedRefreshToken,
        },
      );
    } catch (error) {
      throw error;
    }
  }

  async findOneByEmail(emailAddress: string): Promise<User> {
    const foundUser = await this.userModel.findOne({ emailAddress });
    return foundUser;
  }

  async findOneById(id: string): Promise<User> {
    const user = await this.userModel.findOne({ id }).exec();
    return user;
  }
}
