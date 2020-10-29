import { User } from "@aws-cdk/aws-iam";
import { Key } from "@aws-cdk/aws-kms";
import { App, Duration, Stack } from "@aws-cdk/core";
import { Database } from "../../src/timestream";
import "@aws-cdk/assert/jest";

describe("Database", () => {
  test("with default", () => {
    const app = new App();
    const stack = new Stack(app);
    new Database(stack, "DB");

    expect(stack).toHaveResource("AWS::Timestream::Database");
  });

  test("with KMS key", () => {
    const app = new App();
    const stack = new Stack(app);
    const key = new Key(stack, "EncryptionKey");
    new Database(stack, "DB", { key });

    expect(stack).toHaveResource("AWS::Timestream::Database", {
      KmsKeyId: {
        Ref: "EncryptionKey1B843E66",
      },
    });
  });

  describe("addTable", () => {
    test("ok", () => {
      const app = new App();
      const stack = new Stack(app);
      const db = new Database(stack, "DB");
      db.addTable("Table", {
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
  });

  describe("fromDatabaseArn", () => {
    test("ok", () => {
      const app = new App();
      const databaseArn = ((): string => {
        const stack = new Stack(app, "src");
        const db = new Database(stack, "DB");
        return db.databaseArn;
      })();
      const stack = new Stack(app);
      const db = Database.fromDatabaseArn(stack, "ImportedDB", databaseArn);
      expect(stack.resolve(db.databaseArn)).toStrictEqual({
        "Fn::GetAtt": ["DB4924F778", "Arn"],
      });
      expect(stack.resolve(db.databaseName)).toStrictEqual({
        "Fn::Select": [
          1,
          {
            "Fn::Split": [
              "/",
              {
                "Fn::GetAtt": ["DB4924F778", "Arn"],
              },
            ],
          },
        ],
      });
    });
  });

  describe("IAM actions", () => {
    test("grantRead", () => {
      const stack = new Stack();
      const user = new User(stack, "User");
      Database.grantRead(user);

      expect(stack).toHaveResource("AWS::IAM::Policy", {
        PolicyDocument: {
          Version: "2012-10-17",
          Statement: [
            {
              Action: [
                "timestream:DescribeEndpoints",
                "timestream:ListDatabases",
              ],
              Effect: "Allow",
              Resource: "*",
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

    test("Database.grantWrite", () => {
      const stack = new Stack();
      const user = new User(stack, "User");
      Database.grantWrite(user);

      expect(stack).toHaveResource("AWS::IAM::Policy", {
        PolicyDocument: {
          Version: "2012-10-17",
          Statement: [
            {
              Action: [
                "timestream:CancelQuery",
                "timestream:SelectValues",
                "timestream:CreateDatabase",
                "timestream:DeleteDatabase",
                "timestream:UpdateDatabase",
              ],
              Effect: "Allow",
              Resource: "*",
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

    test("grantRead", () => {
      const stack = new Stack();
      const user = new User(stack, "User");
      const db = new Database(stack, "DB");
      db.grantRead(user);

      expect(stack).toHaveResource("AWS::IAM::Policy", {
        PolicyDocument: {
          Version: "2012-10-17",
          Statement: [
            {
              Action: [
                "timestream:ListTables",
                "timestream:DescribeDatabase",
                "timestream:ListDatabases",
              ],
              Effect: "Allow",
              Resource: { "Fn::GetAtt": ["DB4924F778", "Arn"] },
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
      db.grantWrite(user);

      expect(stack).toHaveResource("AWS::IAM::Policy", {
        PolicyDocument: {
          Version: "2012-10-17",
          Statement: [
            {
              Action: [
                "timestream:CreateTable",
                "timestream:DeleteTable",
                "timestream:UpdateTable",
              ],
              Effect: "Allow",
              Resource: { "Fn::GetAtt": ["DB4924F778", "Arn"] },
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
