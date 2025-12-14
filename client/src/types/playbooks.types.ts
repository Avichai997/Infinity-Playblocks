export enum Trigger {
  MalwareDetected = 'MALWARE_DETECTED',
  LoginAttempt = 'LOGIN_ATTEMPT',
  PhishingAlert = 'PHISHING_ALERT',
}

export enum Action {
  IsolateHost = 'ISOLATE_HOST',
  NotifyAdmin = 'NOTIFY_ADMIN',
  BlockIp = 'BLOCK_IP',
}

export interface IPlaybook {
  id: string;
  name: string;
  trigger: Trigger;
  actions: Action[];
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export interface ICreatePlaybookDto {
  name: string;
  trigger: Trigger;
  actions: Action[];
}

export interface IUpdatePlaybookDto {
  name?: string;
  trigger?: Trigger;
  actions?: Action[];
}
