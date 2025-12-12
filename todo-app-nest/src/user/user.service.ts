import { Injectable } from '@nestjs/common';
import { UserRepository } from './user.repository';

@Injectable()
export class UserService {
  constructor(
    private readonly userRepository: UserRepository,
  ) { }

  async getAllUsers(page: number = 1, limit: number = 10): Promise<Array<{
    userId: string;
    fullName: string;
    email: string;
    role?: string;
    address?: string;
    phoneNumber?: string;
  }>> {
    const users = await this.userRepository.findAll(page, limit);
    return users.map(user => ({
      userId: user._id.toString(),
      fullName: user.fullName,
      email: user.email,
      role: user.role,
      address: user.address,
      phoneNumber: user.phoneNumber
    })
    );
  }

  async getUserById(userId: string): Promise<{ userId: string; fullName: string; email: string }> {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }
    return {
      userId: user._id.toString(),
      fullName: user.fullName,
      email: user.email,
    };
  }

  async updateUser(userId: string, updateData: Partial<{ fullName: string; email: string; password: string }>) {
    const updatedUser = await this.userRepository.update(userId, updateData);
    if (!updatedUser) {
      throw new Error('User not found');
    }
    return updatedUser;
  }

  async deleteUser(userId: string) {
    const deletedUser = await this.userRepository.delete(userId);
    if (!deletedUser) {
      throw new Error('User not found');
    }
    return deletedUser;
  }

}
