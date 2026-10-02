/**
 * ELYSE DEV — database package entry point.
 *
 * Exposed as both `@elyse/database` (full API) and `@elyse/database/types`
 * (types only — safe for the Next.js client bundle).
 */
export * from "./types.js";
export {
  createContentStore,
  resolveContentStore,
  getStoreMeta,
  resetContentStore,
} from "./store/index.js";
export type {
  ContentStore,
  ContactMessageContext,
  StoreResolution,
} from "./store/index.js";
export { getModels } from "./models/index.js";
export type { DatabaseModels } from "./models/index.js";

/** Name of the primary Mongo database used by the project. */
export const DATABASE_NAME = "elyse_dev";
