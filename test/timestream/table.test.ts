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
});
