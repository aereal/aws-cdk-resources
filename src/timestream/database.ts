import { Grant, IGrantable } from "@aws-cdk/aws-iam";
import { IKey } from "@aws-cdk/aws-kms";
import { CfnDatabase } from "@aws-cdk/aws-timestream";
import { Construct, Fn, Resource } from "@aws-cdk/core";
import { IDatabase } from "./database-ref";
import {
  DatabaseAction,
  GlobalAction,
  databaseReadActions,
  databaseWriteActions,
  globalReadActions,
  globalWriteActions,
} from "./iam";
import { AddTableOptions, Table } from "./table";

export interface DatabaseProps {
  readonly databaseName?: string;
  readonly key?: IKey;
}

/**
 *
 */
export class Database extends Resource implements IDatabase {
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
   *
   */
  public static fromDatabaseArn(
    scope: Construct,
    id: string,
    databaseArn: string
  ): IDatabase {
    return new ImportedDatabase(scope, id, databaseArn);
  }

  /**
   *
   */
  public static grant(grantee: IGrantable, ...actions: GlobalAction[]): Grant {
    return Grant.addToPrincipal({
      grantee,
      resourceArns: ["*"],
      actions,
    });
  }

  /**
   *
   */
  public static grantRead(grantee: IGrantable): Grant {
    return Database.grant(grantee, ...globalReadActions);
  }

  /**
   *
   */
  public static grantWrite(grantee: IGrantable): Grant {
    return Database.grant(grantee, ...globalWriteActions);
  }

  /**
   *
   */
  public addTable(id: string, options?: AddTableOptions): Table {
    return new Table(this, id, { database: this, ...options });
  }

  /**
   *
   */
  public grant(grantee: IGrantable, ...actions: DatabaseAction[]): Grant {
    return Grant.addToPrincipal({
      grantee,
      resourceArns: [this.databaseArn],
      actions,
    });
  }

  /**
   *
   */
  public grantRead(grantee: IGrantable): Grant {
    return this.grant(grantee, ...databaseReadActions);
  }

  /**
   *
   */
  public grantWrite(grantee: IGrantable): Grant {
    return this.grant(grantee, ...databaseWriteActions);
  }
}

class ImportedDatabase extends Resource implements IDatabase {
  public readonly databaseArn: string;
  public readonly databaseName: string;

  constructor(scope: Construct, id: string, databaseArn: string) {
    super(scope, id);
    this.databaseArn = databaseArn;
    this.databaseName = Fn.select(1, Fn.split("/", databaseArn));
  }
}
