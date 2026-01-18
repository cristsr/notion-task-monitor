import { NotifierTypes } from '../types';

export const NOTIFIERS = 'NOTIFIERS';

export abstract class NotifierPort {
  abstract readonly instance: NotifierTypes;
  abstract notify(payload: any): Promise<void> | void;
}
