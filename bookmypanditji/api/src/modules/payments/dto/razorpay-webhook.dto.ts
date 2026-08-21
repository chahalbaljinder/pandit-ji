import { ApiProperty } from '@nestjs/swagger';

export class RazorpayWebhookDto {
  @ApiProperty()
  event: string;

  @ApiProperty()
  payload: {
    payment: {
      entity: {
        id: string;
        order_id: string;
        amount: number;
        currency: string;
        status: string;
        method: string;
        error_description?: string;
        error_code?: string;
        error_source?: string;
        error_step?: string;
        error_reason?: string;
        [key: string]: any;
      };
    };
  };
}