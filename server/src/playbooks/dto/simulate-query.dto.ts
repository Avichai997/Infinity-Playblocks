import { IsEnum } from 'class-validator';

import { Trigger } from '@/playbooks/entities';

export class SimulateQueryDto {
  @IsEnum(Trigger)
  trigger: Trigger;
}
