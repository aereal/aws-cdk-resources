import { Grant, IGrantable } from "@aws-cdk/aws-iam";
import { DatabaseAction } from "./iam";

export interface IDatabase {
  readonly databaseName: string;
  readonly databaseArn: string;
  readonly grant: (grantee: IGrantable, ...actions: DatabaseAction[]) => Grant;
  readonly grantWrite: (grantee: IGrantable) => Grant;
  readonly grantRead: (grantee: IGrantable) => Grant;
}
