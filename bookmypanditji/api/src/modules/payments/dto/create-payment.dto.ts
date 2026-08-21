import { IsString, IsNumber, IsOptional, IsEnum, Min, IsUrl } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { PaymentStatus } from '@prisma/client';

export class CreatePaymentDto {
  @ApiProperty()
  @IsString()
  bookingId: string;

  @ApiProperty()
  @IsNumber()
  @Min(0)
  amount: number;

  @ApiPropertyOptional({ default: 'INR' })
  @IsOptional()
  @IsString()
  currency?: string;

  @ApiProperty({ enum: ['RAZORPAY', 'STRIPE', 'WALLET', 'UPI', 'CARD', 'NET_BANKING'] })
  @IsEnum(['RAZORPAY', 'STRIPE', 'WALLET', 'UPI', 'CARD', 'NET_BANKING'])
  method: string;

  @ApiPropertyOptional()
  @IsOptional()
  metadata?: any;
}

export class RazorpayWebhookDto {
  @ApiProperty()
  @IsString()
  event: string;

  @ApiProperty()
  payload: any;
}