import { IsString, IsEnum, IsArray, ArrayMinSize, ArrayMaxSize, MinLength } from 'class-validator';

import { Action, Trigger } from '@/playbooks/entities';

export class CreatePlaybookDto {
  @IsString()
  @MinLength(1)
  name: string;

  @IsEnum(Trigger)
  trigger: Trigger;

  @IsArray()
  @IsEnum(Action, { each: true })
  @ArrayMinSize(1)
  @ArrayMaxSize(3)
  actions: Action[];
}
