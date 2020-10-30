import { Duration } from "@aws-cdk/core";

/**
 * The retention duration for the memory store and magnetic store.
 *
 * @see https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-timestream-table.html#cfn-timestream-table-retentionproperties
 */
export interface TableRetention {
  /**
   * Retention duration for memory store.
   */
  readonly memoryStoreRetentionPeriod: Duration;

  /**
   * Retention duration for magnetic store.
   */
  readonly magneticStoreRetentionPeriod: Duration;
}

/**
 * Options to add a table.
 */
export interface AddTableOptions {
  /**
   * Enforces a paticular physical table name.
   */
  readonly tableName?: string;

  /**
   * How long the table records stored on particular storage.
   */
  readonly retention?: TableRetention;
}
