import { WebSocketGateway, WebSocketServer, SubscribeMessage, OnGatewayConnection, OnGatewayDisconnect, ConnectedSocket, MessageBody } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { JwtService } from '@nestjs/jwt';
import { ChatService } from './chat.service';
import { Logger } from '@nestjs/common';

@WebSocketGateway({
  cors: { origin: '*', credentials: true },
  namespace: '/chat',
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private readonly logger = new Logger(ChatGateway.name);
  private userSockets = new Map<string, Set<string>>(); // userId -> Set of socketIds

  constructor(
    private jwtService: JwtService,
    private chatService: ChatService,
  ) {}

  async handleConnection(client: Socket) {
    try {
      const token = client.handshake.auth?.token || client.handshake.headers?.authorization?.split(' ')[1];
      if (!token) {
        client.disconnect();
        return;
      }

      const payload = this.jwtService.verify(token);
      client.data.userId = payload.sub;
      client.data.userRole = payload.role;

      // Track user sockets
      if (!this.userSockets.has(payload.sub)) {
        this.userSockets.set(payload.sub, new Set());
      }
      this.userSockets.get(payload.sub)!.add(client.id);

      this.logger.log(`Client connected: ${client.id} (user: ${payload.sub})`);
    } catch (error) {
      this.logger.warn(`Connection rejected: ${error.message}`);
      client.disconnect();
    }
  }

  handleDisconnect(client: Socket) {
    const userId = client.data.userId;
    if (userId && this.userSockets.has(userId)) {
      this.userSockets.get(userId)!.delete(client.id);
      if (this.userSockets.get(userId)!.size === 0) {
        this.userSockets.delete(userId);
      }
    }
    this.logger.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('joinRoom')
  async handleJoinRoom(@ConnectedSocket() client: Socket, @MessageBody() data: { roomId: string }) {
    const room = await this.chatService.getUserRooms(client.data.userId);
    const hasAccess = room.some(r => r.id === data.roomId);

    if (!hasAccess) {
      client.emit('error', { message: 'Not authorized to join this room' });
      return;
    }

    client.join(data.roomId);
    this.logger.log(`User ${client.data.userId} joined room ${data.roomId}`);
  }

  @SubscribeMessage('leaveRoom')
  handleLeaveRoom(@ConnectedSocket() client: Socket, @MessageBody() data: { roomId: string }) {
    client.leave(data.roomId);
  }

  @SubscribeMessage('sendMessage')
  async handleSendMessage(@ConnectedSocket() client: Socket, @MessageBody() data: { roomId: string; content: string; type?: string }) {
    try {
      const message = await this.chatService.sendMessage(
        data.roomId,
        client.data.userId,
        data.content,
        data.type || 'TEXT',
      );

      // Emit to room
      this.server.to(data.roomId).emit('newMessage', message);
    } catch (error) {
      client.emit('error', { message: error.message });
    }
  }

  @SubscribeMessage('markRead')
  async handleMarkRead(@ConnectedSocket() client: Socket, @MessageBody() data: { roomId: string }) {
    await this.chatService.markAsRead(data.roomId, client.data.userId);
    this.server.to(data.roomId).emit('messagesRead', { userId: client.data.userId });
  }

  @SubscribeMessage('typing')
  handleTyping(@ConnectedSocket() client: Socket, @MessageBody() data: { roomId: string; isTyping: boolean }) {
    client.to(data.roomId).emit('userTyping', { userId: client.data.userId, isTyping: data.isTyping });
  }

  // Helper to send notification to user
  sendToUser(userId: string, event: string, data: any) {
    const sockets = this.userSockets.get(userId);
    if (sockets) {
      sockets.forEach(socketId => {
        this.server.to(socketId).emit(event, data);
      });
    }
  }
}