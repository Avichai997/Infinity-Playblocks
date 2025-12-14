import {
  IsString,
  IsEnum,
  IsArray,
  ArrayMinSize,
  ArrayMaxSize,
  MinLength,
  IsOptional,
} from 'class-validator';

import { Action, Trigger } from '@/playbooks/entities';

export class UpdatePlaybookDto {
  @IsOptional()
  @IsString()
  @MinLength(1)
  name?: string;

  @IsOptional()
  @IsEnum(Trigger)
  trigger?: Trigger;

  @IsOptional()
  @IsArray()
  @IsEnum(Action, { each: true })
  @ArrayMinSize(1)
  @ArrayMaxSize(3)
  actions?: Action[];
}
