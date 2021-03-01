import { Grant, IGrantable } from "@aws-cdk/aws-iam";
import { arnForParameterName } from "@aws-cdk/aws-ssm/lib/util";
import { Construct } from "@aws-cdk/core";

/**
 * An SSM Parameter path representation.
 */
export class ParameterPath extends Construct {
  private readonly value: string;

  constructor(scope: Construct, id: string, path: string) {
    super(scope, id);
    this.value = path;
  }

  /**
   * Permits an IAM principal all read operations from this parameter path.
   *
   * @param grantee - The principal
   */
  public grantRead(grantee: IGrantable): Grant {
    return Grant.addToPrincipal({
      grantee,
      resourceArns: [arnForParameterName(this, this.value)],
      actions: ["ssm:GetParametersByPath"],
    });
  }
}
