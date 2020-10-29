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
