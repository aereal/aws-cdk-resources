import { Duration } from "@aws-cdk/core";

export interface TableRetention {
  readonly memoryStoreRetentionPeriod: Duration;
  readonly magneticStoreRetentionPeriod: Duration;
}

export interface AddTableOptions {
  readonly tableName?: string;
  readonly retention?: TableRetention;
}
