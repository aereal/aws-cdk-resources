export const globalWriteActions = [
  "timestream:CancelQuery",
  "timestream:SelectValues",
  "timestream:CreateDatabase",
  "timestream:DeleteDatabase",
  "timestream:UpdateDatabase",
] as const;

/**
 * non-resource-specific write IAM actions.
 */
export type GlobalWriteAction = typeof globalWriteActions[number];

export const globalReadActions = [
  "timestream:DescribeEndpoints",
  "timestream:ListDatabases",
] as const;

/**
 * non-resource-specific read IAM actions.
 */
export type GlobalReadAction = typeof globalReadActions[number];

/**
 * All of non-resource-specific IAM actions.
 */
export type GlobalAction = GlobalWriteAction | GlobalReadAction;

export const databaseReadActions = [
  "timestream:ListTables",
  "timestream:DescribeDatabase",
  "timestream:ListDatabases",
] as const;

/**
 * Database-related read IAM actions.
 */
export type DatabaseReadAction = typeof databaseReadActions[number];

export const databaseWriteActions = [
  "timestream:CreateTable",
  "timestream:DeleteTable",
  "timestream:UpdateTable",
] as const;

/**
 * Database-related write IAM actions.
 */
export type DatabaseWriteAction = typeof databaseWriteActions[number];

/**
 * All of database-related IAM actions.
 */
export type DatabaseAction = DatabaseReadAction | DatabaseWriteAction;

export const tableReadActions = [
  "timestream:Select",
  "timestream:ListMeasures",
  "timestream:DescribeTable",
] as const;

/**
 * Table-related read IAM actions.
 */
export type TableReadAction = typeof tableReadActions[number];

export const tableWriteActions = ["timestream:WriteRecords"] as const;

/**
 * Table-related write IAM actions.
 */
export type TableWriteAction = typeof tableWriteActions[number];

/**
 * All of table-related IAM actions.
 */
export type TableAction = TableReadAction | TableWriteAction;
