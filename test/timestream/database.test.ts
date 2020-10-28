import { Key } from "@aws-cdk/aws-kms";
import { App, Stack } from "@aws-cdk/core";
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
});
