import { Controller, Get, Post, Put, Param, Body, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';

import { NotificationsService } from './notifications.service';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Role, NotificationStatus } from '@prisma/client';

@ApiTags('Notifications')
@Controller('notifications')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class NotificationsController {
  constructor(private notificationsService: NotificationsService) {}

  @Get()
  @ApiOperation({ summary: 'Get my notifications' })
  @ApiResponse({ status: 200, description: 'Paginated notifications' })
  async findMine(@CurrentUser('id') userId: string, @Query() params: { page?: number; limit?: number; status?: NotificationStatus }) {
    return this.notificationsService.findByUser(userId, params);
  }

  @Get('unread-count')
  @ApiOperation({ summary: 'Get unread count' })
  @ApiResponse({ status: 200, description: 'Unread count' })
  async getUnreadCount(@CurrentUser('id') userId: string) {
    return { count: await this.notificationsService.getUnreadCount(userId) };
  }

  @Put(':id/read')
  @ApiOperation({ summary: 'Mark notification as read' })
  @ApiResponse({ status: 200, description: 'Marked as read' })
  async markAsRead(@CurrentUser('id') userId: string, @Param('id') id: string) {
    return this.notificationsService.markAsRead(id, userId);
  }

  @Put('read-all')
  @HttpCode(200)
  @ApiOperation({ summary: 'Mark all notifications as read' })
  @ApiResponse({ status: 200, description: 'All marked as read' })
  async markAllAsRead(@CurrentUser('id') userId: string) {
    return { count: await this.notificationsService.markAllAsRead(userId) };
  }

  @Delete(':id')
  @HttpCode(200)
  @ApiOperation({ summary: 'Delete notification' })
  @ApiResponse({ status: 200, description: 'Notification deleted' })
  async delete(@CurrentUser('id') userId: string, @Param('id') id: string) {
    await this.notificationsService.delete(id, userId);
    return { message: 'Notification deleted' };
  }

  @Post()
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN, Role.SUPER_ADMIN)
  @ApiOperation({ summary: 'Create notification (Admin)' })
  @ApiResponse({ status: 201, description: 'Notification created' })
  async create(@Body() dto: CreateNotificationDto) {
    return this.notificationsService.create(dto);
  }

  @Post('bulk')
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN, Role.SUPER_ADMIN)
  @ApiOperation({ summary: 'Create bulk notifications (Admin)' })
  @ApiResponse({ status: 201, description: 'Notifications created' })
  async createBulk(@Body() body: { userIds: string[]; title: string; message: string; type: string }) {
    return this.notificationsService.createBulk(body.userIds, { title: body.title, message: body.message, type: body.type as any });
  }
}