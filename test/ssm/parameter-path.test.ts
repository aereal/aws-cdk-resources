import { expect as cdkExpect, haveResource } from "@aws-cdk/assert";
import { User } from "@aws-cdk/aws-iam";
import { Stack } from "@aws-cdk/core";
import { ParameterPath } from "../../src/ssm/parameter-path";

describe("ParameterPath", () => {
  test("grantRead", () => {
    const stack = new Stack(undefined, "my-stack");
    const user = new User(stack, "User");
    const paramPath = new ParameterPath(stack, "Param", "my-param");
    paramPath.grantRead(user);

    // expect(SynthUtils.synthesize(stack).template).toStrictEqual({});
    cdkExpect(stack).to(
      haveResource("AWS::IAM::Policy", {
        PolicyDocument: {
          Statement: [
            {
              Action: "ssm:GetParametersByPath",
              Effect: "Allow",
              Resource: {
                "Fn::Join": [
                  "",
                  [
                    "arn:",
                    { Ref: "AWS::Partition" },
                    ":ssm:",
                    { Ref: "AWS::Region" },
                    ":",
                    { Ref: "AWS::AccountId" },
                    ":parameter/my-param",
                  ],
                ],
              },
            },
          ],
          Version: "2012-10-17",
        },
        PolicyName: "UserDefaultPolicy1F97781E",
        Users: [{ Ref: "User00B015A1" }],
      })
    );
  });
});
