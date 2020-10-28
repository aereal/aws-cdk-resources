import { expect as cdkExpect } from "@aws-cdk/assert";
import { App, Stack } from "@aws-cdk/core";
import { EmptyResource } from "../src/empty-resource";

describe("EmptyResource", () => {
  test("CloudFormation", () => {
    const app = new App();
    const stack = new Stack(app, "test-stack");
    new EmptyResource(stack, "MyResource");
    cdkExpect(stack).toMatch({});
  });
});
