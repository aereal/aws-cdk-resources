import { Grant, IGrantable } from "@aws-cdk/aws-iam";
import { AddTableOptions } from "./add-table-options";
import { DatabaseAction } from "./iam";
import { ITable } from "./table-ref";

/**
 * An interface represents a Timestream database either created with the CDK or an existing one.
 */
export interface IDatabase {
  /**
   * The name of this database.
   */
  readonly databaseName: string;

  /**
   * The ARN of this database.
   */
  readonly databaseArn: string;

  /**
   * Adds an IAM policy statement associated with this table to an IAM principal's policy.
   *
   * @param grantee - The principal
   * @param actions - The set of actions to allow
   */
  readonly grant: (grantee: IGrantable, ...actions: DatabaseAction[]) => Grant;

  /**
   * Permits an IAM principal all write operations from this table.
   *
   * @param grantee - The principal
   */
  readonly grantWrite: (grantee: IGrantable) => Grant;

  /**
   * Permits an IAM principal all read operations from this table.
   *
   * @param grantee - The principal
   */
  readonly grantRead: (grantee: IGrantable) => Grant;

  /**
   * Add a table to this database.
   *
   * @param id - The name of created table
   * @param options - The options to create table
   */
  readonly addTable: (id: string, options?: AddTableOptions) => ITable;
}
