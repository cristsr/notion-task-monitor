import { NotifierServicePort } from '../ports/output';

export enum NotifierTypes {
  PUSHOVER = 'PUSHOVER',
  DISCORD = 'DISCORD',
}

export type Notifiers = Map<NotifierTypes, NotifierServicePort>;
