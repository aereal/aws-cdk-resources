import { Grant, IGrantable } from "@aws-cdk/aws-iam";
import { CfnTable } from "@aws-cdk/aws-timestream";
import { Construct, Resource } from "@aws-cdk/core";
import { AddTableOptions } from "./add-table-options";
import { IDatabase } from "./database-ref";
import { TableAction, tableReadActions, tableWriteActions } from "./iam";
import { ITable } from "./table-ref";

abstract class TableBase extends Resource implements ITable {
  public abstract readonly tableArn: string;

  /**
   *
   */
  public grant(grantee: IGrantable, ...actions: TableAction[]): Grant {
    return Grant.addToPrincipal({
      grantee,
      resourceArns: [this.tableArn],
      actions,
    });
  }

  /**
   *
   */
  public grantRead(grantee: IGrantable): Grant {
    return this.grant(grantee, ...tableReadActions);
  }

  /**
   *
   */
  public grantWrite(grantee: IGrantable): Grant {
    return this.grant(grantee, ...tableWriteActions);
  }
}

export interface TableProps extends AddTableOptions {
  readonly database: IDatabase;
}

/**
 *
 */
export class Table extends TableBase {
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
