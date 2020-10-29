import { User } from "@aws-cdk/aws-iam";
import { App, Construct, Duration, Stack } from "@aws-cdk/core";
import { Database, ITable, Table } from "../../src/timestream";
import "@aws-cdk/assert/jest";

describe("Table", () => {
  test("minimal", () => {
    const app = new App();
    const stack = new Stack(app);
    const database = new Database(stack, "DB");
    const table = new Table(stack, "Table", { database });

    expect(stack).toHaveResource("AWS::Timestream::Table", {});
    expect(stack.resolve(table.tableName)).toStrictEqual({
      "Fn::Select": [
        3,
        { "Fn::Split": ["/", { "Fn::GetAtt": ["TableCD117FA1", "Arn"] }] },
      ],
    });
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

  test("fromTableArn", () => {
    const stack = new Stack();
    const table = Table.fromTableArn(
      stack,
      "Table",
      "arn:aws:timestream:us-east-1:1234567890:database/dbName/table/tableName"
    );
    expect(table.tableArn).toEqual(
      "arn:aws:timestream:us-east-1:1234567890:database/dbName/table/tableName"
    );
    expect(stack.resolve(table.tableName)).toStrictEqual("tableName");
  });

  describe("IAM actions", () => {
    test.each([
      [
        "grantRead",
        "built resource",
        (scope: Construct): ITable => {
          const db = new Database(scope, "DB");
          return db.addTable("Table");
        },
        [
          "timestream:Select",
          "timestream:ListMeasures",
          "timestream:DescribeTable",
        ],
        {
          "Fn::GetAtt": ["DBTableB8E07EFE", "Arn"],
        },
      ],
      [
        "grantRead",
        "imported resource",
        (scope: Construct): ITable => {
          const app = (scope.node.scope as unknown) as App;
          const stack = new Stack(app, "src-stack");
          const db = new Database(stack, "DB");
          const srcTable = db.addTable("Table");
          return Table.fromTableArn(scope, "Table", srcTable.tableArn);
        },
        [
          "timestream:Select",
          "timestream:ListMeasures",
          "timestream:DescribeTable",
        ],
        {
          "Fn::ImportValue":
            "src-stack:ExportsOutputFnGetAttDBTableB8E07EFEArn3442B74A",
        },
      ],
      [
        "grantWrite",
        "built resource",
        (scope: Construct): ITable => {
          const db = new Database(scope, "DB");
          return db.addTable("Table");
        },
        "timestream:WriteRecords",
        {
          "Fn::GetAtt": ["DBTableB8E07EFE", "Arn"],
        },
      ],
    ])("%s/%s", (method, kind, buildTable, actions, targetResource) => {
      const app = new App();
      const stack = new Stack(app, "stack-1");
      const user = new User(stack, "User");
      const table = buildTable(stack);
      switch (method) {
        case "grantRead":
          table.grantRead(user);
          break;
        case "grantWrite":
          table.grantWrite(user);
          break;
      }

      expect(stack).toHaveResource("AWS::IAM::Policy", {
        PolicyDocument: {
          Version: "2012-10-17",
          Statement: [
            {
              Action: actions,
              Effect: "Allow",
              Resource: targetResource,
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
