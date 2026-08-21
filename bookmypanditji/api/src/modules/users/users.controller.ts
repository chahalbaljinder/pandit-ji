import { Controller, Get, Put, Post, Delete, Body, Param, Query, UseGuards, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';

import { UsersService } from './users.service';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { AddVirtualUserDto } from './dto/add-virtual-user.dto';
import { UpdateVirtualUserDto } from './dto/update-virtual-user.dto';
import { AddAddressDto } from './dto/add-address.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Public } from '../../common/decorators/public.decorator';
import { Role, UserStatus } from '@prisma/client';

@ApiTags('Users')
@Controller('users')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class UsersController {
  constructor(private usersService: UsersService) {}

  // Profile
  @Get('me')
  @ApiOperation({ summary: 'Get current user profile' })
  @ApiResponse({ status: 200, description: 'User profile' })
  async getProfile(@CurrentUser('id') userId: string) {
    return this.usersService.getProfile(userId);
  }

  @Put('me')
  @ApiOperation({ summary: 'Update current user profile' })
  @ApiResponse({ status: 200, description: 'Profile updated' })
  async updateProfile(@CurrentUser('id') userId: string, @Body() dto: UpdateProfileDto) {
    return this.usersService.updateProfile(userId, dto);
  }

  @Delete('me')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Deactivate account' })
  @ApiResponse({ status: 200, description: 'Account deactivated' })
  async deactivateAccount(@CurrentUser('id') userId: string) {
    await this.usersService.deactivateAccount(userId);
    return { message: 'Account deactivated' };
  }

  // Virtual Users
  @Post('me/virtual-users')
  @ApiOperation({ summary: 'Add virtual user (spouse/child)' })
  @ApiResponse({ status: 201, description: 'Virtual user created' })
  async addVirtualUser(@CurrentUser('id') userId: string, @Body() dto: AddVirtualUserDto) {
    return this.usersService.addVirtualUser(userId, dto);
  }

  @Get('me/virtual-users')
  @ApiOperation({ summary: 'Get virtual users' })
  @ApiResponse({ status: 200, description: 'List of virtual users' })
  async getVirtualUsers(@CurrentUser('id') userId: string) {
    return this.usersService.getVirtualUsers(userId);
  }

  @Put('me/virtual-users/:id')
  @ApiOperation({ summary: 'Update virtual user' })
  @ApiResponse({ status: 200, description: 'Virtual user updated' })
  async updateVirtualUser(
    @CurrentUser('id') userId: string,
    @Param('id') virtualUserId: string,
    @Body() dto: UpdateVirtualUserDto,
  ) {
    return this.usersService.updateVirtualUser(userId, virtualUserId, dto);
  }

  @Delete('me/virtual-users/:id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete virtual user' })
  @ApiResponse({ status: 200, description: 'Virtual user deleted' })
  async deleteVirtualUser(@CurrentUser('id') userId: string, @Param('id') virtualUserId: string) {
    await this.usersService.deleteVirtualUser(userId, virtualUserId);
    return { message: 'Virtual user deleted' };
  }

  // Addresses
  @Post('me/addresses')
  @ApiOperation({ summary: 'Add address' })
  @ApiResponse({ status: 201, description: 'Address created' })
  async addAddress(@CurrentUser('id') userId: string, @Body() dto: AddAddressDto) {
    return this.usersService.addAddress(userId, dto);
  }

  @Get('me/addresses')
  @ApiOperation({ summary: 'Get all addresses' })
  @ApiResponse({ status: 200, description: 'List of addresses' })
  async getAddresses(@CurrentUser('id') userId: string) {
    return this.usersService.getAddresses(userId);
  }

  @Get('me/addresses/default')
  @ApiOperation({ summary: 'Get default address' })
  @ApiResponse({ status: 200, description: 'Default address' })
  async getDefaultAddress(@CurrentUser('id') userId: string) {
    return this.usersService.getDefaultAddress(userId);
  }

  @Put('me/addresses/:id')
  @ApiOperation({ summary: 'Update address' })
  @ApiResponse({ status: 200, description: 'Address updated' })
  async updateAddress(
    @CurrentUser('id') userId: string,
    @Param('id') addressId: string,
    @Body() dto: Partial<AddAddressDto>,
  ) {
    return this.usersService.updateAddress(userId, addressId, dto);
  }

  @Delete('me/addresses/:id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete address' })
  @ApiResponse({ status: 200, description: 'Address deleted' })
  async deleteAddress(@CurrentUser('id') userId: string, @Param('id') addressId: string) {
    await this.usersService.deleteAddress(userId, addressId);
    return { message: 'Address deleted' };
  }

  // Admin endpoints
  @Get()
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN, Role.SUPER_ADMIN)
  @ApiOperation({ summary: 'Get all users (Admin)' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'search', required: false, type: String })
  @ApiQuery({ name: 'role', required: false, enum: Role })
  @ApiQuery({ name: 'status', required: false, enum: UserStatus })
  @ApiResponse({ status: 200, description: 'Paginated users' })
  async findAll(
    @Query('page') page = 1,
    @Query('limit') limit = 20,
    @Query('search') search?: string,
    @Query('role') role?: Role,
    @Query('status') status?: UserStatus,
  ) {
    return this.usersService.findAll({
      page: Number(page),
      limit: Number(limit),
      search,
      role,
      status,
    });
  }

  @Put(':id/status')
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN, Role.SUPER_ADMIN)
  @ApiOperation({ summary: 'Update user status (Admin)' })
  @ApiResponse({ status: 200, description: 'Status updated' })
  async updateStatus(@Param('id') userId: string, @Body() body: { status: UserStatus }) {
    return this.usersService.updateUserStatus(userId, body.status);
  }

  @Put(':id/role')
  @UseGuards(RolesGuard)
  @Roles(Role.SUPER_ADMIN)
  @ApiOperation({ summary: 'Update user role (Super Admin)' })
  @ApiResponse({ status: 200, description: 'Role updated' })
  async updateRole(@Param('id') userId: string, @Body() body: { role: Role }) {
    return this.usersService.updateUserRole(userId, body.role);
  }
}