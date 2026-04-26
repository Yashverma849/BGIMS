import type { CmsAdapter } from './types';
import { localStorageAdapter } from './local-storage';
import { httpAdapter } from './http';

const useServerApi = import.meta.env.PUBLIC_USE_SERVER_API === 'true';

export const cms: CmsAdapter = useServerApi ? httpAdapter : localStorageAdapter;

export * from './types';
