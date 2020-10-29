import { Grant, IGrantable } from "@aws-cdk/aws-iam";
import { TableAction } from "./iam";

export interface ITable {
  readonly tableArn: string;
  readonly tableName: string;
  readonly grant: (grantee: IGrantable, ...actions: TableAction[]) => Grant;
  readonly grantRead: (grantee: IGrantable) => Grant;
  readonly grantWrite: (grantee: IGrantable) => Grant;
}
