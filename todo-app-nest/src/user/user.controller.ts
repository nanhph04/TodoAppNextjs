import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { UserService } from './user.service';
import { UseGuards, Req } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) { }

  @Get('profile')
  @UseGuards(AuthGuard('jwt'))
  getProfile(@Req() req: any) {
    const userId = req.user?.sub;
    return this.userService.getUserById(userId);
  }

  @Get()
  @UseGuards(AuthGuard('jwt'))
  getAllUsers(
    @Req() req: any,
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '10',
  ) {
    // console.log('User payload:', req.user);
    return this.userService.getAllUsers(Number(page), Number(limit));
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'))
  deleteUser(@Param('id') id: string) {
    return this.userService.deleteUser(id);
  }

  @Get('/permissions')
  @UseGuards(AuthGuard('jwt'))
  getUserPermissions(@Req() req: any) {
    const userId = req.user?.sub;
    // console.log('UserID for permissions:', userId, 'Payload:', req.user);

    return this.userService.getUserPermissions(userId);
  }

  @Get('/ by-email')
  getUserByEmail(@Query('email') email: string) {
    return this.userService.getUserByEmail(email);
  }
}
