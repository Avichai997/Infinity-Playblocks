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

export interface IUser {
  id: string;
  email: string;
}

export interface IPlaybook {
  id: string;
  name: string;
  trigger: Trigger;
  actions: Action[];
  userId: string;
  createdAt: string;
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

export interface ILoginDto {
  email: string;
  password: string;
}

export interface IRegisterDto {
  email: string;
  password: string;
}
