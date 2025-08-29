import { Body, Controller, Delete, Get, Param, ParseUUIDPipe, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { OrganizationsService } from './organizations.service';
import { Roles } from 'src/auth/roles.decorator';
import { AuthGuard } from 'src/auth/auth.guard';
import { OrganizationsCreateDTO, OrganizationsPaginationDTO, OrganizationsUpdateDTO } from './organizations.dto';

@UseGuards(AuthGuard)
@Roles('admin')
@Controller('organizations')
export class OrganizationsController {
  constructor(private readonly service: OrganizationsService) {}

  @Post()
  create(@Body() dto: OrganizationsCreateDTO) {
    return this.service.create(dto as any);
  }

  @Get()
  findAll(@Query() query: OrganizationsPaginationDTO) {
    return this.service.findAll(query as any);
  }

  @Get(':id')
  findOne(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.service.findOne(id, { withUsers: true });
  }

  @Patch(':id')
  update(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() dto: OrganizationsUpdateDTO,
  ) {
    return this.service.update(id, dto as any);
  }

  @Delete(':id')
  remove(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.service.remove(id);
  }
}
