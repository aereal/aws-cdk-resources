export const globalWriteActions = [
  "timestream:CancelQuery",
  "timestream:SelectValues",
  "timestream:CreateDatabase",
  "timestream:DeleteDatabase",
  "timestream:UpdateDatabase",
] as const;

export type GlobalWriteAction = typeof globalWriteActions[number];

export const globalReadActions = [
  "timestream:DescribeEndpoints",
  "timestream:ListDatabases",
] as const;

export type GlobalReadAction = typeof globalReadActions[number];

export type GlobalAction = GlobalWriteAction | GlobalReadAction;

export const databaseReadActions = [
  "timestream:ListTables",
  "timestream:DescribeDatabase",
  "timestream:ListDatabases",
] as const;

export type DatabaseReadAction = typeof databaseReadActions[number];

export const databaseWriteActions = [
  "timestream:CreateTable",
  "timestream:DeleteTable",
  "timestream:UpdateTable",
] as const;

export type DatabaseWriteAction = typeof databaseWriteActions[number];

export type DatabaseAction = DatabaseReadAction | DatabaseWriteAction;

export const tableReadActions = [
  "timestream:Select",
  "timestream:ListMeasures",
  "timestream:DescribeTable",
] as const;

export type TableReadAction = typeof tableReadActions[number];

export const tableWriteActions = ["timestream:WriteRecords"] as const;

export type TableWriteAction = typeof tableWriteActions[number];

export type TableAction = TableReadAction | TableWriteAction;
