<template>
  <Card>
    <CardHeader class="px-4 py-3 border-b">
      <div class="flex items-center justify-between">
        <CardTitle>Databases</CardTitle>

        <Dialog v-model:open="showCreateDialog">
          <DialogTrigger as-child>
            <Button size="sm">
              <PlusIcon class="mr-2 h-4 w-4" />
              New Database
            </Button>
          </DialogTrigger>

          <DialogContent class="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Create Database</DialogTitle>
              <DialogDescription>
                Create a new database entry. This UI expects the backend to
                provide a `databases` API surface.
              </DialogDescription>
            </DialogHeader>

            <form class="space-y-4" @submit.prevent="createDatabase">
              <div>
                <Label for="name" class="block text-sm font-medium mb-1">
                  Name
                </Label>
                <Input id="name" v-model="newDatabase.name" required />
              </div>

              <div>
                <Label for="host" class="block text-sm font-medium mb-1">
                  Host
                </Label>
                <Input
                  id="host"
                  v-model="newDatabase.host"
                  placeholder="localhost"
                  required
                />
              </div>

              <div class="grid grid-cols-2 gap-2">
                <div>
                  <Label for="port" class="block text-sm font-medium mb-1"
                    >Port</Label
                  >
                  <Input
                    id="port"
                    v-model="newDatabase.port"
                    placeholder="3306"
                    required
                  />
                </div>
                <div>
                  <Label for="database" class="block text-sm font-medium mb-1"
                    >Database</Label
                  >
                  <Input
                    id="database"
                    v-model="newDatabase.database"
                    placeholder="my_database"
                    required
                  />
                </div>
              </div>

              <div>
                <Label for="username" class="block text-sm font-medium mb-1"
                  >Username</Label
                >
                <Input
                  id="username"
                  v-model="newDatabase.username"
                  placeholder="readonly_user"
                />
              </div>

              <div>
                <Label for="password" class="block text-sm font-medium mb-1"
                  >Password</Label
                >
                <Input
                  id="password"
                  v-model="newDatabase.password"
                  type="password"
                />
              </div>

              <div class="flex items-center gap-2">
                <input
                  id="ssl"
                  v-model="newDatabase.ssl"
                  type="checkbox"
                  class="form-checkbox"
                />
                <Label for="ssl" class="text-sm">Require SSL</Label>
              </div>

              <DialogFooter>
                <Button type="button" variant="ghost" @click="resetForm">
                  Cancel
                </Button>
                <Button type="submit" :disabled="isCreating">
                  <Loader2Icon
                    v-if="isCreating"
                    class="mr-2 h-4 w-4 animate-spin"
                  />
                  {{ isCreating ? 'Creating...' : 'Create' }}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </CardHeader>

    <CardContent class="p-0">
      <div v-if="isLoading" class="p-4">
        <div
          class="flex items-center justify-center gap-2 text-muted-foreground"
        >
          <Loader2Icon class="h-5 w-5 animate-spin" />
          <span>Loading databases...</span>
        </div>
      </div>

      <div v-else-if="error" class="p-4">
        <Alert variant="destructive">
          <AlertCircleIcon class="h-4 w-4" />
          <div class="ml-2">
            <div class="font-medium">Error</div>
            <div class="text-sm text-muted-foreground">{{ error }}</div>
          </div>
        </Alert>
      </div>

      <div v-else-if="databases.length === 0" class="p-6">
        <div class="text-center py-8">
          <DatabaseIcon class="mx-auto h-12 w-12 text-gray-400" />
          <h3 class="mt-2 text-sm font-medium text-gray-900">No databases</h3>
          <p class="mt-1 text-sm text-gray-500">
            Create a database to get started.
          </p>
        </div>
      </div>

      <div v-else class="divide-y">
        <div
          v-for="db in databases"
          :key="db.id"
          class="px-6 py-4 hover:bg-gray-50"
        >
          <div>
            <div class="min-w-0">
              <div class="flex items-center justify-between gap-4">
                <div class="inline-flex items-center">
                  <Database class="h-4 w-4 text-gray-500 inline-block mr-2" />
                  <h3 class="text-sm font-medium truncate">{{ db.name }}</h3>
                </div>

                <span
                  :class="db.isActive ? 'text-green-500' : 'text-red-600'"
                  class="font-medium inline-flex items-center gap-2 leading-5 text-xs"
                >
                  <span>{{ db.isActive ? 'Active' : 'Inactive' }}</span>
                </span>
              </div>

              <div
                class="mt-2 flex items-center gap-3 text-xs text-muted-foreground"
              >
                <Badge variant="secondary">
                  <span class="truncate">{{ db.database }}</span>
                </Badge>
                <div
                  class="min-w-0 flex items-center gap-2 whitespace-nowrap overflow-hidden"
                >
                  <span class="truncate">{{ db.host }}:{{ db.port }}</span>
                  <span class="opacity-40">•</span>
                  <span class="truncate">{{ db.username }}</span>
                </div>
              </div>

              <div class="mt-2 text-xs text-muted-foreground">
                <div>Created {{ formatDate(db.createdAt) }}</div>
              </div>
            </div>

            <div class="mt-2 flex items-start gap-2">
              <Button
                variant="ghost"
                size="sm"
                title="Test connection"
                @click="testConnection(db)"
              >
                <Loader2Icon
                  v-if="testing[db.id]"
                  class="h-4 w-4 animate-spin"
                />
                <Settings v-else class="h-4 w-4" />
              </Button>

              <Button
                variant="ghost"
                size="sm"
                title="Details"
                @click="showDetails(db)"
              >
                <EyeIcon class="h-4 w-4" />
              </Button>

              <Button
                variant="ghost"
                size="sm"
                class="text-destructive"
                @click="confirmDrop(db)"
              >
                <TrashIcon class="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      <!-- Details Dialog -->
      <Dialog v-model:open="showDetailsDialog">
        <DialogContent class="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Database Details</DialogTitle>
          </DialogHeader>

          <div class="space-y-3">
            <div>
              <div class="text-sm font-medium">Name</div>
              <div class="text-sm">{{ selectedDb?.name }}</div>
            </div>
            <div>
              <div class="text-sm font-medium">Connection</div>
              <div class="text-sm">
                {{ selectedDb?.host }}:{{ selectedDb?.port }} /
                {{ selectedDb?.database }}
              </div>
            </div>
            <div>
              <div class="text-sm font-medium">Username</div>
              <div class="text-sm">{{ selectedDb?.username }}</div>
            </div>
            <div v-if="selectedDb?.createdAt">
              <div class="text-sm font-medium">Created</div>
              <div class="text-sm">{{ formatDate(selectedDb?.createdAt) }}</div>
            </div>
          </div>

          <DialogFooter>
            <Button @click="closeDetails">Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <!-- Drop confirmation dialog -->
      <Dialog v-model:open="showDropDialog">
        <DialogContent class="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>Confirm Drop</DialogTitle>
            <DialogDescription
              >Dropping a database is irreversible. Are you
              sure?</DialogDescription
            >
          </DialogHeader>
          <DialogFooter>
            <Button variant="ghost" @click="cancelDrop">Cancel</Button>
            <Button class="text-destructive" @click="performDrop">Drop</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </CardContent>
  </Card>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue';
import { storeToRefs } from 'pinia';
import { useDatabasesStore } from '@/stores/databases';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
  DialogFooter,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Loader2Icon,
  PlusIcon,
  TrashIcon,
  AlertCircleIcon,
  Eye as EyeIcon,
  Settings,
  Database,
} from 'lucide-vue-next';
import { Alert } from '@/components/ui/alert';
import { Database as DatabaseIcon } from 'lucide-vue-next';
import { formatDate } from '@/lib/utils';
import Badge from '../ui/badge/Badge.vue';

const store = useDatabasesStore();
const { databases, isLoading, error } = storeToRefs(store);

const isCreating = ref(false);
const showCreateDialog = ref(false);

// Lightweight type for the database record used in this component.
interface DatabaseRecord {
  id: string;
  name?: string;
  host?: string;
  database?: string;
  port?: number | string;
  username?: string;
  password?: string;
  ssl?: boolean | number;
  isActive?: boolean | number;
  createdAt?: string | Date | null;
  updatedAt?: string | Date | null;
}

// UI state for per-db operations
const testing = reactive<Record<string, boolean>>({});
const showDetailsDialog = ref(false);
const selectedDb = ref<DatabaseRecord | null>(null);

const showDropDialog = ref(false);
const pendingDrop = ref<DatabaseRecord | null>(null);

const newDatabase = reactive({
  name: '',
  host: 'localhost',
  port: '3306',
  database: '',
  username: '',
  password: '',
  ssl: false,
});

const load = async () => {
  await store.loadDatabases();
};

const createDatabase = async () => {
  try {
    isCreating.value = true;
    await store.createDatabase({
      name: newDatabase.name,
      host: newDatabase.host,
      port: Number(newDatabase.port),
      database: newDatabase.database || newDatabase.name,
      username: newDatabase.username,
      password: newDatabase.password,
      ssl: newDatabase.ssl,
    });
    resetForm();
  } catch {
    // store.error will contain message
  } finally {
    load();

    isCreating.value = false;
  }
};

const dropDatabase = async (db: DatabaseRecord) => {
  try {
    await store.dropDatabase(db.id);
  } catch {
    // store.error
  }
};

const confirmDrop = (db: DatabaseRecord) => {
  pendingDrop.value = db;
  showDropDialog.value = true;
};

const cancelDrop = () => {
  pendingDrop.value = null;
  showDropDialog.value = false;
};

const performDrop = async () => {
  if (!pendingDrop.value) return;
  try {
    await dropDatabase(pendingDrop.value);
  } finally {
    pendingDrop.value = null;
    showDropDialog.value = false;
  }
};

const showDetails = (db: DatabaseRecord) => {
  selectedDb.value = db;
  showDetailsDialog.value = true;
};

const closeDetails = () => {
  selectedDb.value = null;
  showDetailsDialog.value = false;
};

const testConnection = async (db: DatabaseRecord) => {
  if (!db || !db.id) return;
  testing[db.id] = true;
  try {
    await store.testDatabaseConnection(db.id);
    // Optionally, we could surface a brief success state via UI — omitted for simplicity.
  } catch {
    // store.error will contain message
  } finally {
    testing[db.id] = false;
  }
};

const resetForm = () => {
  newDatabase.name = '';
  showCreateDialog.value = false;
};

onMounted(() => load());

defineExpose({ loadDatabases: load });
</script>
