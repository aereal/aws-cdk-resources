import { IKey } from "@aws-cdk/aws-kms";
import { CfnDatabase } from "@aws-cdk/aws-timestream";
import { Construct, Resource } from "@aws-cdk/core";
import { IDatabase } from "./database-ref";

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
}
