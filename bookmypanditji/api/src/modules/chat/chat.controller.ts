import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';

import { ChatService } from './chat.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@ApiTags('Chat')
@Controller('chat')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class ChatController {
  constructor(private chatService: ChatService) {}

  @Get('rooms')
  @ApiOperation({ summary: 'Get my chat rooms' })
  @ApiResponse({ status: 200, description: 'List of chat rooms' })
  async getRooms(@CurrentUser('id') userId: string) {
    return this.chatService.getUserRooms(userId);
  }

  @Get('rooms/:roomId/messages')
  @ApiOperation({ summary: 'Get messages for room' })
  @ApiResponse({ status: 200, description: 'Messages' })
  async getMessages(
    @CurrentUser('id') userId: string,
    @Param('roomId') roomId: string,
    @Query('page') page = 1,
    @Query('limit') limit = 50,
  ) {
    return this.chatService.getMessages(roomId, userId, Number(page), Number(limit));
  }
}