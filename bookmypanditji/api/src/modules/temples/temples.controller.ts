import { Controller, Get, Post, Put, Delete, Param, Body, Query, UseGuards, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';

import { TemplesService } from './temples.service';
import { CreateTempleDto } from './dto/create-temple.dto';
import { UpdateTempleDto } from './dto/update-temple.dto';
import { TempleSearchDto } from './dto/temple-search.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { Public } from '../../common/decorators/public.decorator';
import { Role } from '@prisma/client';

@ApiTags('Temples')
@Controller('temples')
export class TemplesController {
  constructor(private templesService: TemplesService) {}

  @Get()
  @Public()
  @ApiOperation({ summary: 'Search temples' })
  @ApiResponse({ status: 200, description: 'Paginated temples' })
  async search(@Query() dto: TempleSearchDto) {
    return this.templesService.search(dto);
  }

  @Get('live-darshan')
  @Public()
  @ApiOperation({ summary: 'Get temples with live darshan' })
  @ApiResponse({ status: 200, description: 'Temples with live darshan' })
  async getLiveDarshan() {
    return this.templesService.getLiveDarshanTemples();
  }

  @Get('cities')
  @Public()
  @ApiOperation({ summary: 'Get list of cities with temples' })
  @ApiResponse({ status: 200, description: 'Cities list' })
  async getCities() {
    return this.templesService.getCities();
  }

  @Get(':id')
  @Public()
  @ApiOperation({ summary: 'Get temple by ID' })
  @ApiResponse({ status: 200, description: 'Temple details' })
  async findById(@Param('id') id: string) {
    return this.templesService.findById(id);
  }

  @Get('slug/:slug')
  @Public()
  @ApiOperation({ summary: 'Get temple by slug' })
  @ApiResponse({ status: 200, description: 'Temple details' })
  async findBySlug(@Param('slug') slug: string) {
    return this.templesService.findBySlug(slug);
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.SUPER_ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create temple (Admin)' })
  @ApiResponse({ status: 201, description: 'Temple created' })
  async create(@Body() dto: CreateTempleDto) {
    return this.templesService.create(dto);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.SUPER_ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update temple (Admin)' })
  @ApiResponse({ status: 200, description: 'Temple updated' })
  async update(@Param('id') id: string, @Body() dto: UpdateTempleDto) {
    return this.templesService.update(id, dto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.SUPER_ADMIN)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete temple (Admin)' })
  @ApiResponse({ status: 200, description: 'Temple deleted' })
  async delete(@Param('id') id: string) {
    await this.templesService.delete(id);
    return { message: 'Temple deleted' };
  }
}