import { Controller, Get, Post, Put, Delete, Param, Body, Query, UseGuards, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';

import { ServicesService } from './services.service';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';
import { ServiceSearchDto } from './dto/service-search.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { Public } from '../../common/decorators/public.decorator';
import { Role } from '@prisma/client';

@ApiTags('Services')
@Controller('services')
export class ServicesController {
  constructor(private servicesService: ServicesService) {}

  @Get()
  @Public()
  @ApiOperation({ summary: 'Search services' })
  @ApiResponse({ status: 200, description: 'Paginated services' })
  async search(@Query() dto: ServiceSearchDto) {
    return this.servicesService.search(dto);
  }

  @Get('categories')
  @Public()
  @ApiOperation({ summary: 'Get service categories' })
  @ApiResponse({ status: 200, description: 'List of categories' })
  async getCategories() {
    return this.servicesService.getCategories();
  }

  @Get('featured')
  @Public()
  @ApiOperation({ summary: 'Get featured services' })
  @ApiResponse({ status: 200, description: 'Featured services' })
  async getFeatured(@Query('limit') limit = 8) {
    return this.servicesService.getFeatured(Number(limit));
  }

  @Get(':id')
  @Public()
  @ApiOperation({ summary: 'Get service by ID' })
  @ApiResponse({ status: 200, description: 'Service details' })
  @ApiResponse({ status: 404, description: 'Not found' })
  async findById(@Param('id') id: string) {
    return this.servicesService.findById(id);
  }

  @Get('slug/:slug')
  @Public()
  @ApiOperation({ summary: 'Get service by slug' })
  @ApiResponse({ status: 200, description: 'Service details' })
  @ApiResponse({ status: 404, description: 'Not found' })
  async findBySlug(@Param('slug') slug: string) {
    return this.servicesService.findBySlug(slug);
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.SUPER_ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create service (Admin)' })
  @ApiResponse({ status: 201, description: 'Service created' })
  async create(@Body() dto: CreateServiceDto) {
    return this.servicesService.create(dto);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.SUPER_ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update service (Admin)' })
  @ApiResponse({ status: 200, description: 'Service updated' })
  async update(@Param('id') id: string, @Body() dto: UpdateServiceDto) {
    return this.servicesService.update(id, dto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.SUPER_ADMIN)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete service (Admin)' })
  @ApiResponse({ status: 200, description: 'Service deleted' })
  async delete(@Param('id') id: string) {
    await this.servicesService.delete(id);
    return { message: 'Service deleted' };
  }

  @Post(':id/pandits/:panditId')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.SUPER_ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Assign pandit to service (Admin)' })
  @ApiResponse({ status: 201, description: 'Pandit assigned' })
  async addPandit(@Param('id') serviceId: string, @Param('panditId') panditId: string, @Body() body: { price: number }) {
    return this.servicesService.addPanditService(serviceId, panditId, body.price);
  }

  @Delete(':id/pandits/:panditId')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.SUPER_ADMIN)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Remove pandit from service (Admin)' })
  @ApiResponse({ status: 200, description: 'Pandit removed' })
  async removePandit(@Param('id') serviceId: string, @Param('panditId') panditId: string) {
    await this.servicesService.removePanditService(serviceId, panditId);
    return { message: 'Pandit removed from service' };
  }

  @Get('pandits/:panditId/services')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get pandit services' })
  @ApiResponse({ status: 200, description: 'Pandit services' })
  async getPanditServices(@Param('panditId') panditId: string) {
    return this.servicesService.getPanditServices(panditId);
  }
}