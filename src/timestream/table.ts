import { Grant, IGrantable } from "@aws-cdk/aws-iam";
import { CfnTable } from "@aws-cdk/aws-timestream";
import { Construct, Fn, Resource } from "@aws-cdk/core";
import { AddTableOptions } from "./add-table-options";
import { IDatabase } from "./database-ref";
import { TableAction, tableReadActions, tableWriteActions } from "./iam";
import { ITable } from "./table-ref";

abstract class TableBase extends Resource implements ITable {
  public abstract readonly tableArn: string;

  public get tableName(): string {
    return Fn.select(3, Fn.split("/", this.tableArn));
  }

  /**
   * Adds an IAM policy statement associated with this table to an IAM principal's policy.
   *
   * @param grantee - The principal
   * @param actions - The set of actions to allow
   */
  public grant(grantee: IGrantable, ...actions: TableAction[]): Grant {
    return Grant.addToPrincipal({
      grantee,
      resourceArns: [this.tableArn],
      actions,
    });
  }

  /**
   * Permits an IAM principal all read operations from this table.
   *
   * @param grantee - The principal
   */
  public grantRead(grantee: IGrantable): Grant {
    return this.grant(grantee, ...tableReadActions);
  }

  /**
   * Permits an IAM principal all write operations from this table.
   *
   * @param grantee - The principal
   */
  public grantWrite(grantee: IGrantable): Grant {
    return this.grant(grantee, ...tableWriteActions);
  }
}

/**
 * Properties for a Timestream table
 */
export interface TableProps extends AddTableOptions {
  /**
   * A database that the table belongs to
   */
  readonly database: IDatabase;
}

/**
 * Provides a Timestream table
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

  /**
   * Creates a Table construct that represents an external table via table ARN.
   *
   * @param scope - The parent creating construct
   * @param id - The construct's name
   * @param tableArn - The table's ARN
   */
  public static fromTableArn(
    scope: Construct,
    id: string,
    tableArn: string
  ): ITable {
    return new ImportedTable(scope, id, tableArn);
  }
}

class ImportedTable extends TableBase {
  public readonly tableArn: string;

  constructor(scope: Construct, id: string, tableArn: string) {
    super(scope, id);
    this.tableArn = tableArn;
  }
}
