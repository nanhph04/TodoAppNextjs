import { Injectable } from '@nestjs/common';
import { UserRepository } from './user.repository';
import { RoleRepository } from 'src/roles/role.repository';
import { Types } from 'mongoose';

@Injectable()
export class UserService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly roleRepository: RoleRepository,
  ) { }

  async getAllUsers(page: number = 1, limit: number = 10): Promise<Array<{
    userId: string;
    fullName: string;
    email: string;
    roles?: string[];
    address?: string;
    phoneNumber?: string;
  }>> {
    const users = await this.userRepository.findAll(page, limit);
    if (!users) {
      throw new Error('Users not found');
    }

    // For each user, fetch their roles' names
    return Promise.all(users.map(async user => {
      const roleIds = user.roles || [];
      let roles: string[] = [];
      if (roleIds.length > 0) {
        const ids = roleIds.map((id: any) => new Types.ObjectId(id));
        const roleDocs = await this.roleRepository.findByIds(ids);
        roles = roleDocs.map(r => r.name);
      }
      return {
        userId: user._id.toString(),
        fullName: user.fullName,
        email: user.email,
        roles,
        address: user.address,
        phoneNumber: user.phoneNumber
      };
    }));
  }

  async getUserById(userId: string): Promise<{ userId: string; fullName: string; email: string, roles?: string[] }> {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }
    const roleIds = user.roles || [];
    let roles: string[] = [];
    if (roleIds.length > 0) {
      const ids = roleIds.map((id: any) => new Types.ObjectId(id));
      const roleDocs = await this.roleRepository.findByIds(ids);
      roles = roleDocs.map(r => r.name);
    }
    return {
      userId: user._id.toString(),
      fullName: user.fullName,
      email: user.email,
      roles,
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

  async getUserPermissions(userId: string): Promise<string[]> {
    const user = await this.userRepository.findById(userId);
    if (!user) return [];

    const roleIds = user.roles || [];
    if (roleIds.length === 0) return [];
    const ids = roleIds.map((id: any) => new Types.ObjectId(id));
    const roleDocs = await this.roleRepository.findByIds(ids);
    const slugs = roleDocs
      .flatMap(r => r.permissions)
      .map(p => (typeof p === 'string' ? p : p.slug));
    return [...new Set(slugs)];
  }

  async getUserByEmail(email: string) {
    return this.userRepository.findByEmail(email);
  }


}
