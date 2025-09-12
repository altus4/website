import { defineStore } from 'pinia';
import { Altus4SDK } from '@altus4/sdk';
import type {
  DatabaseConnection,
  AddDatabaseConnectionRequest,
  UpdateDatabaseConnectionRequest,
} from '@altus4/sdk';

function createSdk() {
  const baseURL =
    import.meta.env.VITE_ALTUS4_API_URL ||
    import.meta.env.VITE_API_BASE_URL ||
    'http://localhost:3000/api/v1';
  return new Altus4SDK({ baseURL });
}

export const useDatabasesStore = defineStore('databases', {
  state: () => ({
    databases: [] as DatabaseConnection[],
    isLoading: false as boolean,
    error: null as string | null,
  }),
  actions: {
    async loadDatabases() {
      this.isLoading = true;
      this.error = null;
      try {
        const sdk = createSdk();
        // SDK shape may vary; try common method name `listDatabases`
        const res = await sdk.database.listDatabaseConnections();
        if (res?.success) {
          const data = res.data as unknown;
          let list: DatabaseConnection[] = [];
          if (Array.isArray(data)) list = data as DatabaseConnection[];
          else if (data && typeof data === 'object') {
            const maybe = data as { items?: unknown; databases?: unknown };
            if (Array.isArray(maybe.items))
              list = maybe.items as DatabaseConnection[];
            else if (Array.isArray(maybe.databases))
              list = maybe.databases as DatabaseConnection[];
          }
          this.databases = list;
        } else {
          this.error = res?.error?.message || 'Failed to load databases';
        }
      } catch (e: unknown) {
        this.error =
          e instanceof Error ? e.message : 'Failed to load databases';
      } finally {
        this.isLoading = false;
      }
    },

    async createDatabase(payload: AddDatabaseConnectionRequest) {
      this.error = null;
      try {
        const sdk = createSdk();
        const res = await sdk.database.addDatabaseConnection?.(payload);
        if (res?.success) {
          // if API returns created object, try to insert it; otherwise refresh
          const d = res.data as unknown;
          let created: unknown | undefined;
          if (d && typeof d === 'object' && d !== null) {
            const obj = d as Record<string, unknown>;
            if ('database' in obj) {
              created = obj.database;
            }
          }
          if (created)
            this.databases = [created as DatabaseConnection, ...this.databases];
          else await this.loadDatabases();
          return res.data;
        }
        throw new Error(res?.error?.message || 'Failed to create database');
      } catch (e: unknown) {
        const msg =
          e instanceof Error ? e.message : 'Failed to create database';
        this.error = msg;
        throw new Error(msg);
      }
    },

    async getDatabaseConnection(id: string) {
      this.error = null;
      try {
        const sdk = createSdk();
        const res = await sdk.database.getDatabaseConnection?.(id);
        if (res?.success) {
          return res.data as unknown;
        }
        throw new Error(
          res?.error?.message || 'Failed to get database connection'
        );
      } catch (e: unknown) {
        const msg =
          e instanceof Error ? e.message : 'Failed to get database connection';
        this.error = msg;
        throw new Error(msg);
      }
    },

    async updateDatabaseConnection(id: string, updates: unknown) {
      this.error = null;
      try {
        const sdk = createSdk();
        const res = await sdk.database.updateDatabaseConnection?.(
          id,
          updates as UpdateDatabaseConnectionRequest
        );
        if (res?.success) {
          // refresh local list
          await this.loadDatabases();
          return res.data as unknown;
        }
        throw new Error(
          res?.error?.message || 'Failed to update database connection'
        );
      } catch (e: unknown) {
        const msg =
          e instanceof Error
            ? e.message
            : 'Failed to update database connection';
        this.error = msg;
        throw new Error(msg);
      }
    },

    async testDatabaseConnection(id: string) {
      this.error = null;
      try {
        const sdk = createSdk();
        const res = await sdk.database.testDatabaseConnection?.(id);
        if (res?.success) {
          return res.data as unknown;
        }
        throw new Error(
          res?.error?.message || 'Failed to test database connection'
        );
      } catch (e: unknown) {
        const msg =
          e instanceof Error ? e.message : 'Failed to test database connection';
        this.error = msg;
        throw new Error(msg);
      }
    },

    async getDatabaseSchema(connectionId: string) {
      this.error = null;
      try {
        const sdk = createSdk();
        const res = await sdk.database.getDatabaseSchema?.(connectionId);
        if (res?.success) {
          return res.data as unknown;
        }
        throw new Error(res?.error?.message || 'Failed to get database schema');
      } catch (e: unknown) {
        const msg =
          e instanceof Error ? e.message : 'Failed to get database schema';
        this.error = msg;
        throw new Error(msg);
      }
    },

    async dropDatabase(id: string) {
      this.error = null;
      try {
        const sdk = createSdk();
        const res = await sdk.database?.removeDatabaseConnection?.(id);
        if (res?.success) {
          // remove locally
          this.databases = this.databases.filter(d => d.id !== id);
          return true;
        }
        throw new Error(res?.error?.message || 'Failed to drop database');
      } catch (e: unknown) {
        const msg = e instanceof Error ? e.message : 'Failed to drop database';
        this.error = msg;
        throw new Error(msg);
      }
    },
  },
});
