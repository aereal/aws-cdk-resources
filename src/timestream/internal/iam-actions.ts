/**
 * @internal
 */
export const globalWriteActions = [
  "timestream:CancelQuery",
  "timestream:SelectValues",
  "timestream:CreateDatabase",
  "timestream:DeleteDatabase",
  "timestream:UpdateDatabase",
] as const;

/**
 * @internal
 */
export const globalReadActions = [
  "timestream:DescribeEndpoints",
  "timestream:ListDatabases",
] as const;

/**
 * @internal
 */
export const databaseReadActions = [
  "timestream:ListTables",
  "timestream:DescribeDatabase",
  "timestream:ListDatabases",
] as const;

/**
 * @internal
 */
export const databaseWriteActions = [
  "timestream:CreateTable",
  "timestream:DeleteTable",
  "timestream:UpdateTable",
] as const;

/**
 * @internal
 */
export const tableReadActions = [
  "timestream:Select",
  "timestream:ListMeasures",
  "timestream:DescribeTable",
] as const;

/**
 * @internal
 */
export const tableWriteActions = ["timestream:WriteRecords"] as const;
