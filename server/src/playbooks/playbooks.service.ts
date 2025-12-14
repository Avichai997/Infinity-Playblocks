import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CreatePlaybookDto, UpdatePlaybookDto } from '@/playbooks/dto';
import { Playbook, Trigger } from '@/playbooks/entities';

@Injectable()
export class PlaybooksService {
  constructor(
    @InjectRepository(Playbook)
    private readonly playbookRepository: Repository<Playbook>,
  ) {}

  async create(userId: string, createPlaybookDto: CreatePlaybookDto): Promise<Playbook> {
    const playbook = this.playbookRepository.create({
      ...createPlaybookDto,
      userId,
    });

    return this.playbookRepository.save(playbook);
  }

  async findAll(userId: string): Promise<Playbook[]> {
    return this.playbookRepository.find({
      where: { userId },
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string, userId: string): Promise<Playbook> {
    const playbook = await this.playbookRepository.findOne({
      where: { id },
    });

    if (!playbook) {
      throw new NotFoundException('Playbook not found');
    }

    if (playbook.userId !== userId) {
      throw new ForbiddenException('You do not have access to this playbook');
    }

    return playbook;
  }

  async update(
    id: string,
    userId: string,
    updatePlaybookDto: UpdatePlaybookDto,
  ): Promise<Playbook> {
    const playbook = await this.findOne(id, userId);
    if (!playbook) {
      throw new NotFoundException('Playbook not found');
    }
    Object.assign(playbook, updatePlaybookDto);
    return this.playbookRepository.save(playbook);
  }

  async remove(id: string, userId: string): Promise<void> {
    const playbook = await this.findOne(id, userId);
    await this.playbookRepository.remove(playbook);
  }

  async findMatchingPlaybooks(trigger: Trigger, userId: string): Promise<Playbook[]> {
    return this.playbookRepository.find({
      where: {
        trigger,
        userId,
      },
      order: { createdAt: 'DESC' },
    });
  }
}
