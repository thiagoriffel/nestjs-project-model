import { Body, Controller, Post, HttpCode, HttpStatus, Get, Query } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUsersDTO } from './users.dto';

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
