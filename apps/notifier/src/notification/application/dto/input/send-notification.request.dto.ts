import { Notification } from '../../../domain';
import { IsNumber, IsOptional, IsString } from 'class-validator';
import { NotifierTypes } from '../../types';

export class SendNotificationRequest implements Notification {
  @IsString()
  title: string;

  @IsString()
  message: string;

  @IsString()
  @IsOptional()
  url: string;

  @IsString()
  @IsOptional()
  urlTitle: string;

  @IsNumber()
  @IsOptional()
  ttl: number;

  @IsString()
  provider: NotifierTypes;
}
