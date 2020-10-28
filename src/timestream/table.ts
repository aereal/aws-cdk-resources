import { CfnTable } from "@aws-cdk/aws-timestream";
import { Construct, Duration, Resource } from "@aws-cdk/core";
import { IDatabase } from "./database-ref";
import { ITable } from "./table-ref";

export interface TableRetention {
  readonly memoryStoreRetentionPeriod: Duration;
  readonly magneticStoreRetentionPeriod: Duration;
}

export interface AddTableOptions {
  readonly tableName?: string;
  readonly retention?: TableRetention;
}

export interface TableProps extends AddTableOptions {
  readonly database: IDatabase;
}

/**
 *
 */
export class Table extends Resource implements ITable {
  public readonly tableArn: string;

  constructor(scope: Construct, id: string, props: TableProps) {
    const {
      tableName,
      database: { databaseName },
      retention,
    } = props;
    super(scope, id, { physicalName: tableName });

    const resource = (this.node.defaultChild = new CfnTable(this, "Resource", {
      tableName: this.physicalName,
      databaseName,
      retentionProperties:
        retention !== undefined
          ? {
              MemoryStoreRetentionPeriodInHours: retention.memoryStoreRetentionPeriod
                .toHours()
                .toString(),
              MagneticStoreRetentionPeriodInDays: retention.magneticStoreRetentionPeriod
                .toDays()
                .toString(),
            }
          : undefined,
    }));

    this.tableArn = resource.attrArn;
  }
}
