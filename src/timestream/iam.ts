import {
  databaseReadActions,
  databaseWriteActions,
  globalReadActions,
  globalWriteActions,
  tableReadActions,
  tableWriteActions,
} from "./internal/iam-actions";

/**
 * non-resource-specific write IAM actions.
 */
export type GlobalWriteAction = typeof globalWriteActions[number];

/**
 * non-resource-specific read IAM actions.
 */
export type GlobalReadAction = typeof globalReadActions[number];

/**
 * All of non-resource-specific IAM actions.
 */
export type GlobalAction = GlobalWriteAction | GlobalReadAction;

/**
 * Database-related read IAM actions.
 */
export type DatabaseReadAction = typeof databaseReadActions[number];

/**
 * Database-related write IAM actions.
 */
export type DatabaseWriteAction = typeof databaseWriteActions[number];

/**
 * All of database-related IAM actions.
 */
export type DatabaseAction = DatabaseReadAction | DatabaseWriteAction;

/**
 * Table-related read IAM actions.
 */
export type TableReadAction = typeof tableReadActions[number];

/**
 * Table-related write IAM actions.
 */
export type TableWriteAction = typeof tableWriteActions[number];

/**
 * All of table-related IAM actions.
 */
export type TableAction = TableReadAction | TableWriteAction;
