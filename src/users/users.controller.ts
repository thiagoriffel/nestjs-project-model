import { Body, Controller, Post, HttpCode, HttpStatus, Get, Query, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUsersDTO } from './users.dto';
import { AuthGuard } from 'src/auth/auth.guard';
import { Roles } from 'src/auth/roles.decorator';

@UseGuards(AuthGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @Post('create')
  @HttpCode(HttpStatus.OK)
  create(@Body() createUserDto: CreateUsersDTO) {
    return this.userService.create(createUserDto)
  }

  @Get('')
  @HttpCode(HttpStatus.OK)
  findAll(@Query('filter') filter: string,) {
    return this.userService.findAll(filter)
  }
}
