/**
 * ELYSE DEV — connection resolution.
 *
 * `resolveContentStore()` returns a ready-to-use `ContentStore`, choosing the
 * backend at runtime:
 *
 *   1. MONGODB_URI configured and reachable  → MongoDB (Mongoose)
 *   2. MONGODB_URI missing                   → local JSON store
 *   3. MONGODB_URI configured but unreachable → local JSON store, `degraded: true`
 *
 * The third case is logged loudly and surfaced through `GET /api/health` so a
 * misconfigured production deployment is never silently faking success.
 */
import mongoose from "mongoose";
import type { Connection } from "mongoose";
import type { ServiceMeta } from "../types.js";
import { JsonContentStore } from "./json-store.js";
import { MongoContentStore } from "./mongo-store.js";
import type { ContentStore } from "./repository.js";

let storePromise: Promise<ContentStore> | null = null;

export interface StoreResolution {
  store: ContentStore;
  connection: Connection | null;
  meta: ServiceMeta;
}

export async function createContentStore(): Promise<StoreResolution> {
  const uri = process.env.MONGODB_URI?.trim();

  if (!uri) {
    const store = new JsonContentStore();
    await store.init();
    return { store, connection: null, meta: store.meta };
  }

  try {
    const connection = await mongoose
      .createConnection(uri, {
        dbName: process.env.MONGODB_DB?.trim() || "elyse_dev",
        serverSelectionTimeoutMS: Number(
          process.env.MONGODB_TIMEOUT_MS ?? 5000,
        ),
        maxPoolSize: 10,
      })
      .asPromise();

    const store = new MongoContentStore(connection);
    await store.init();
    return { store, connection, meta: store.meta };
  } catch (error) {
    const reason =
      error instanceof Error ? error.message : "unknown connection error";

    console.error(
      `[database] MongoDB unreachable (${reason}). Falling back to the local JSON store — ` +
        "data written here will NOT be visible in MongoDB once it is reachable again.",
    );

    const store = new JsonContentStore();
    await store.init();
    return {
      store,
      connection: null,
      meta: {
        ...store.meta,
        degraded: true,
        details: `MongoDB unreachable (${reason}); serving from the local JSON store.`,
      },
    };
  }
}

/** Cached, process-wide store instance. */
export function resolveContentStore(): Promise<ContentStore> {
  storePromise ??= createContentStore().then((resolution) => {
    lastMeta = resolution.meta;
    return resolution.store;
  });
  return storePromise;
}

let lastMeta: ServiceMeta | null = null;

/** Metadata about the active backend (available after the first resolution). */
export function getStoreMeta(): ServiceMeta {
  return (
    lastMeta ?? {
      backend: "json-store",
      degraded: false,
      details: "Store not initialised yet.",
    }
  );
}

/** Used by scripts and tests to drop the cached connection. */
export async function resetContentStore(): Promise<void> {
  if (!storePromise) return;
  const store = await storePromise;
  await store.close();
  storePromise = null;
  lastMeta = null;
}
