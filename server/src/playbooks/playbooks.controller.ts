import { Controller, Get, Post, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';

import { JwtAuthGuard } from '@/auth/guards/jwt-auth.guard';
import { CurrentUser } from '@/common';
import { CreatePlaybookDto, SimulateQueryDto } from './dto';
import { PlaybooksService } from './playbooks.service';

@Controller('playbooks')
@UseGuards(JwtAuthGuard)
export class PlaybooksController {
  constructor(private readonly playbooksService: PlaybooksService) {}

  @Post()
  create(
    @Body() createPlaybookDto: CreatePlaybookDto,
    @CurrentUser() user: { id: string; email: string },
  ) {
    return this.playbooksService.create(user.id, createPlaybookDto);
  }

  @Get()
  findAll(@CurrentUser() user: { id: string; email: string }) {
    return this.playbooksService.findAll(user.id);
  }

  @Get('simulate')
  simulate(@Query() query: SimulateQueryDto, @CurrentUser() user: { id: string; email: string }) {
    return this.playbooksService.findMatchingPlaybooks(query.trigger, user.id);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @CurrentUser() user: { id: string; email: string }) {
    return this.playbooksService.remove(id, user.id);
  }
}
