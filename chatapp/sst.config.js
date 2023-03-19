import { API } from "./stacks/ApiStack";
import { FrontendStack } from "./stacks/FrontendStack";

export default {
  config(_input) {
    return {
      name: "delte",
      region: "us-east-1",
    };
  },
  stacks(app) {
    app.stack(API).stack(FrontendStack);
  }
}
