import { NotifierServicePort } from '../../application/ports/output';

export const notifierProviderFactory = () => {
  return (...providers: NotifierServicePort[]) => {
    console.log('Creating notifier providers');
    console.log(providers);
    return new Map<string, NotifierServicePort>(
      providers.map((p) => [p.instance, p]),
    );
  };
};
