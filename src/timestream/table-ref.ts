import { Grant, IGrantable } from "@aws-cdk/aws-iam";
import { TableAction } from "./iam";

/**
 * An interface represents a Timestream table either created with the CDK or an existing one.
 */
export interface ITable {
  /**
   * The ARN of this table.
   */
  readonly tableArn: string;

  /**
   * The name of this table.
   */
  readonly tableName: string;

  /**
   * Adds an IAM policy statement associated with this table to an IAM principal's policy.
   *
   * @param grantee - The principal
   * @param actions - The set of actions to allow
   */
  readonly grant: (grantee: IGrantable, ...actions: TableAction[]) => Grant;

  /**
   * Permits an IAM principal all read operations from this table.
   *
   * @param grantee - The principal
   */
  readonly grantRead: (grantee: IGrantable) => Grant;

  /**
   * Permits an IAM principal all write operations from this table.
   *
   * @param grantee - The principal
   */
  readonly grantWrite: (grantee: IGrantable) => Grant;
}
