import { IKey } from "@aws-cdk/aws-kms";
import { CfnDatabase } from "@aws-cdk/aws-timestream";
import { Construct, Fn, Resource } from "@aws-cdk/core";
import { IDatabase } from "./database-ref";
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
  public addTable(id: string, options?: AddTableOptions): Table {
    return new Table(this, id, { database: this, ...options });
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
