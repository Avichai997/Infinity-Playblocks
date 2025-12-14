import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PlaybooksService } from './playbooks.service';
import { Playbook, Trigger, Action } from './entities/playbook.entity';
import { NotFoundException, ForbiddenException } from '@nestjs/common';

describe('PlaybooksService', () => {
  let service: PlaybooksService;
  let repository: Repository<Playbook>;

  const mockRepository = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PlaybooksService,
        {
          provide: getRepositoryToken(Playbook),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<PlaybooksService>(PlaybooksService);
    repository = module.get<Repository<Playbook>>(getRepositoryToken(Playbook));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create a playbook', async () => {
      const userId = 'user-1';
      const createDto = {
        name: 'Test Playbook',
        trigger: Trigger.MalwareDetected,
        actions: [Action.IsolateHost, Action.NotifyAdmin],
      };
      const mockPlaybook = {
        id: '1',
        ...createDto,
        userId,
      };

      mockRepository.create.mockReturnValue(mockPlaybook);
      mockRepository.save.mockResolvedValue(mockPlaybook);

      const result = await service.create(userId, createDto);

      expect(repository.create).toHaveBeenCalledWith({
        ...createDto,
        userId,
      });
      expect(repository.save).toHaveBeenCalledWith(mockPlaybook);
      expect(result).toEqual(mockPlaybook);
    });
  });

  describe('findAll', () => {
    it('should return all playbooks for a user', async () => {
      const userId = 'user-1';
      const mockPlaybooks = [
        {
          id: '1',
          name: 'Playbook 1',
          trigger: Trigger.MalwareDetected,
          actions: [Action.IsolateHost],
          userId,
        },
      ];

      mockRepository.find.mockResolvedValue(mockPlaybooks);

      const result = await service.findAll(userId);

      expect(repository.find).toHaveBeenCalledWith({
        where: { userId },
        order: { createdAt: 'DESC' },
      });
      expect(result).toEqual(mockPlaybooks);
    });
  });

  describe('findOne', () => {
    it('should return a playbook if found and user owns it', async () => {
      const id = '1';
      const userId = 'user-1';
      const mockPlaybook = {
        id,
        name: 'Test Playbook',
        userId,
      };

      mockRepository.findOne.mockResolvedValue(mockPlaybook);

      const result = await service.findOne(id, userId);

      expect(result).toEqual(mockPlaybook);
    });

    it('should throw NotFoundException if playbook not found', async () => {
      const id = '1';
      const userId = 'user-1';

      mockRepository.findOne.mockResolvedValue(null);

      await expect(service.findOne(id, userId)).rejects.toThrow(NotFoundException);
    });

    it('should throw ForbiddenException if user does not own playbook', async () => {
      const id = '1';
      const userId = 'user-1';
      const mockPlaybook = {
        id,
        name: 'Test Playbook',
        userId: 'user-2',
      };

      mockRepository.findOne.mockResolvedValue(mockPlaybook);

      await expect(service.findOne(id, userId)).rejects.toThrow(ForbiddenException);
    });
  });

  describe('remove', () => {
    it('should remove a playbook', async () => {
      const id = '1';
      const userId = 'user-1';
      const mockPlaybook = {
        id,
        name: 'Test Playbook',
        userId,
      };

      mockRepository.findOne.mockResolvedValue(mockPlaybook);
      mockRepository.remove.mockResolvedValue(mockPlaybook);

      await service.remove(id, userId);

      expect(repository.findOne).toHaveBeenCalledWith({ where: { id } });
      expect(repository.remove).toHaveBeenCalledWith(mockPlaybook);
    });
  });

  describe('findMatchingPlaybooks', () => {
    it('should return matching playbooks for a trigger', async () => {
      const trigger = Trigger.MalwareDetected;
      const userId = 'user-1';
      const mockPlaybooks = [
        {
          id: '1',
          name: 'Test Playbook',
          trigger,
          actions: [Action.IsolateHost],
          userId,
        },
      ];

      mockRepository.find.mockResolvedValue(mockPlaybooks);

      const result = await service.findMatchingPlaybooks(trigger, userId);

      expect(repository.find).toHaveBeenCalledWith({
        where: { trigger, userId },
        order: { createdAt: 'DESC' },
      });
      expect(result).toEqual(mockPlaybooks);
    });
  });
});
