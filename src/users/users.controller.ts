import { Body, Controller, Post, HttpCode, HttpStatus, Get, Query, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUsersDTO, UserPaginationDto } from './users.dto';
import { AuthGuard } from 'src/auth/auth.guard';
import { Roles } from 'src/auth/roles.decorator';
import { ApiExtraModels } from '@nestjs/swagger';

@ApiExtraModels(CreateUsersDTO)
@UseGuards(AuthGuard)
@Roles('admin')
@Controller('users')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @Post()
  @HttpCode(HttpStatus.OK)
  create(@Body() createUserDto: CreateUsersDTO) {
    return this.userService.create(createUserDto)
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  findAll(@Query() query: UserPaginationDto) {
    return this.userService.findAll(query as any);
  }
}
