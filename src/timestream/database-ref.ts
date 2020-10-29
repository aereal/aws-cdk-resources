import { Grant, IGrantable } from "@aws-cdk/aws-iam";
import { AddTableOptions } from "./add-table-options";
import { DatabaseAction } from "./iam";
import { ITable } from "./table-ref";

export interface IDatabase {
  readonly databaseName: string;
  readonly databaseArn: string;
  readonly grant: (grantee: IGrantable, ...actions: DatabaseAction[]) => Grant;
  readonly grantWrite: (grantee: IGrantable) => Grant;
  readonly grantRead: (grantee: IGrantable) => Grant;
  readonly addTable: (id: string, options?: AddTableOptions) => ITable;
}
