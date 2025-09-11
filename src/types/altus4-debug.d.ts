import type { Altus4SDK, TokenStorageManager as TSM } from '@altus4/sdk';
import type { AuthStateShape } from '@/plugins/altus4';

type TokenStorageManagerType = typeof TSM;

export interface Altus4Debug {
  sdk: Altus4SDK;
  authState: AuthStateShape;
  TokenStorageManager: TokenStorageManagerType;
  getAuthStatus?: () => unknown;
  debugToken?: () => unknown;
}

declare global {
  interface Window {
    __altus4_debug__?: Altus4Debug;
  }
}

export {};
