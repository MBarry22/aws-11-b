import { API } from "./stacks/ApiStack";
import { FrontendStack } from "./stacks/FrontendStack";
import { MediaAssets } from "./stacks/MediaStack";
export default {
  config(_input) {
    return {
      name: "delte",
      region: "us-east-1",
    };
  },
  stacks(app) {
    app.stack(MediaAssets).stack(API).stack(FrontendStack);
  }
}
