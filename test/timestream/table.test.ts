import { User } from "@aws-cdk/aws-iam";
import { App, Duration, Stack } from "@aws-cdk/core";
import { Database, Table } from "../../src/timestream";
import "@aws-cdk/assert/jest";

describe("Table", () => {
  test("minimal", () => {
    const app = new App();
    const stack = new Stack(app);
    const database = new Database(stack, "DB");
    new Table(stack, "Table", { database });

    expect(stack).toHaveResource("AWS::Timestream::Table", {});
  });

  test("with retention", () => {
    const app = new App();
    const stack = new Stack(app);
    const database = new Database(stack, "DB");
    new Table(stack, "Table", {
      database,
      retention: {
        memoryStoreRetentionPeriod: Duration.hours(12),
        magneticStoreRetentionPeriod: Duration.days(30),
      },
    });

    expect(stack).toHaveResource("AWS::Timestream::Table", {
      RetentionProperties: {
        MemoryStoreRetentionPeriodInHours: "12",
        MagneticStoreRetentionPeriodInDays: "30",
      },
    });
  });

  describe("IAM actions", () => {
    test("grantRead", () => {
      const stack = new Stack();
      const user = new User(stack, "User");
      const db = new Database(stack, "DB");
      const table = db.addTable("Table");
      table.grantRead(user);

      expect(stack).toHaveResource("AWS::IAM::Policy", {
        PolicyDocument: {
          Version: "2012-10-17",
          Statement: [
            {
              Action: [
                "timestream:Select",
                "timestream:ListMeasures",
                "timestream:DescribeTable",
              ],
              Effect: "Allow",
              Resource: { "Fn::GetAtt": ["DBTableB8E07EFE", "Arn"] },
            },
          ],
        },
        PolicyName: "UserDefaultPolicy1F97781E",
        Users: [
          {
            Ref: "User00B015A1",
          },
        ],
      });
    });

    test("grantWrite", () => {
      const stack = new Stack();
      const user = new User(stack, "User");
      const db = new Database(stack, "DB");
      const table = db.addTable("Table");
      table.grantWrite(user);

      expect(stack).toHaveResource("AWS::IAM::Policy", {
        PolicyDocument: {
          Version: "2012-10-17",
          Statement: [
            {
              Action: "timestream:WriteRecords",
              Effect: "Allow",
              Resource: { "Fn::GetAtt": ["DBTableB8E07EFE", "Arn"] },
            },
          ],
        },
        PolicyName: "UserDefaultPolicy1F97781E",
        Users: [
          {
            Ref: "User00B015A1",
          },
        ],
      });
    });
  });
});
