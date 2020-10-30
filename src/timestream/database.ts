import { Grant, IGrantable } from "@aws-cdk/aws-iam";
import { IKey } from "@aws-cdk/aws-kms";
import { CfnDatabase } from "@aws-cdk/aws-timestream";
import { Construct, Fn, Resource } from "@aws-cdk/core";
import { AddTableOptions } from "./add-table-options";
import { IDatabase } from "./database-ref";
import { DatabaseAction, GlobalAction } from "./iam";
import {
  databaseReadActions,
  databaseWriteActions,
  globalReadActions,
  globalWriteActions,
} from "./internal/iam-actions";
import { Table } from "./table";
import { ITable } from "./table-ref";

/**
 * @internal
 */
abstract class DatabaseBase extends Resource implements IDatabase {
  public abstract readonly databaseName: string;
  public abstract readonly databaseArn: string;

  /**
   * Adds an IAM policy statement associated with this table to an IAM principal's policy.
   *
   * @param grantee - The principal
   * @param actions - The set of actions to allow
   */
  public grant(grantee: IGrantable, ...actions: DatabaseAction[]): Grant {
    return Grant.addToPrincipal({
      grantee,
      resourceArns: [this.databaseArn],
      actions,
    });
  }

  /**
   * Permits an IAM principal all read operations from this table.
   *
   * @param grantee - The principal
   */
  public grantRead(grantee: IGrantable): Grant {
    return this.grant(grantee, ...databaseReadActions);
  }

  /**
   * Permits an IAM principal all write operations from this table.
   *
   * @param grantee - The principal
   */
  public grantWrite(grantee: IGrantable): Grant {
    return this.grant(grantee, ...databaseWriteActions);
  }

  /**
   * Add a table to this database.
   *
   * @param id - The name of created table
   * @param options - The options to create table
   */
  public addTable(id: string, options?: AddTableOptions): ITable {
    return new Table(this, id, { database: this, ...options });
  }
}

/**
 * Properties for a Timestream database.
 */
export interface DatabaseProps {
  /**
   * Enforces a paticular physical database name.
   */
  readonly databaseName?: string;

  /**
   * The KMS key used to encrypt the data stored in the database.
   */
  readonly key?: IKey;
}

/**
 * Provides a Timestream database
 */
export class Database extends DatabaseBase {
  public databaseName: string;
  public readonly databaseArn: string;
  private readonly resource: CfnDatabase;

  constructor(scope: Construct, id: string, props?: DatabaseProps) {
    super(scope, id, { physicalName: props?.databaseName });

    this.resource = this.node.defaultChild = new CfnDatabase(this, "Resource", {
      databaseName: this.physicalName,
      kmsKeyId: props?.key?.keyId,
    });
    this.databaseArn = this.resource.attrArn;
    this.databaseName = this.resource.ref;
  }

  /**
   * Creates a Database construct represents an external database via database ARN.
   *
   * @param scope - The parent creating construct
   * @param id - The construct's name
   * @param databaseArn - The database's ARN
   */
  public static fromDatabaseArn(
    scope: Construct,
    id: string,
    databaseArn: string
  ): IDatabase {
    return new ImportedDatabase(scope, id, databaseArn);
  }

  /**
   * Adds an IAM policy statement associated with no resources but related to Timestream database to an IAM principal's policy.
   *
   * @param grantee - The principal
   * @param actions - The set of actions to allow
   */
  public static grant(grantee: IGrantable, ...actions: GlobalAction[]): Grant {
    return Grant.addToPrincipal({
      grantee,
      resourceArns: ["*"],
      actions,
    });
  }

  /**
   * Permits an IAM principal all read operations from Timestream database.
   *
   * @param grantee - The principal
   */
  public static grantRead(grantee: IGrantable): Grant {
    return Database.grant(grantee, ...globalReadActions);
  }

  /**
   * Permits an IAM principal all write operations from Timestream database.
   *
   * @param grantee - The principal
   */
  public static grantWrite(grantee: IGrantable): Grant {
    return Database.grant(grantee, ...globalWriteActions);
  }
}

class ImportedDatabase extends DatabaseBase {
  public readonly databaseArn: string;
  public readonly databaseName: string;

  constructor(scope: Construct, id: string, databaseArn: string) {
    super(scope, id);
    this.databaseArn = databaseArn;
    this.databaseName = Fn.select(1, Fn.split("/", databaseArn));
  }
}
