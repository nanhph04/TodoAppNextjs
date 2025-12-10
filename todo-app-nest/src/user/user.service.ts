import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Model } from 'mongoose';
import { User } from 'src/auth/schema/User.schema';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class UserService {
  constructor(@InjectModel('User') private readonly userModel: Model<User>) { }

  async getUserById(userId: string): Promise<{ userId: string; fullName: string; email: string }> {
    const user = await this.userModel.findById(userId).exec();
    if (!user) {
      throw new Error('User not found');
    }
    return {
      userId: user._id.toString(),
      fullName: user.fullName,
      email: user.email,
    };
  }
}
