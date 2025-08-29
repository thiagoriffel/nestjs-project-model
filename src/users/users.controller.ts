import { Body, Controller, Post, HttpCode, HttpStatus, Get, Query, UseGuards, ParseUUIDPipe, Param, Patch, Delete } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersCreateDTO, UserPaginationDto, UsersUpdateDTO } from './users.dto';
import { AuthGuard } from 'src/auth/auth.guard';
import { Roles } from 'src/auth/roles.decorator';
import { ApiExtraModels } from '@nestjs/swagger';

@ApiExtraModels(UsersCreateDTO)
@UseGuards(AuthGuard)
@Roles('admin')
@Controller('users')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @Post()
  @HttpCode(HttpStatus.OK)
  create(@Body() createUserDto: UsersCreateDTO) {
    return this.userService.create(createUserDto)
  }
  
  @Get()
  findAll(@Query() query: UserPaginationDto) {
    return this.userService.findAll(query as any);
  }

  @Get(':id')
  findOne(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.userService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() dto: UsersUpdateDTO,
  ) {
    return this.userService.update(id, dto as any);
  }

  @Delete(':id')
  remove(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.userService.remove(id);
  }
}
