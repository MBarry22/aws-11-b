import { Api, Cognito, use } from "sst/constructs";
import { MediaAssets } from "./MediaStack";
import * as iam from "aws-cdk-lib/aws-iam";

export function API({ stack }) {

  const { bucket } = use(MediaAssets);

  const auth = new Cognito(stack, "auth", {
    login: ["email", "username"],
  });
  // Adjust the API 
  const api = new Api(stack, "Api", {
    defaults: {
      authorizer: "iam",
      function: {
        environment: {
          DATABASE_URL: process.env.DATABASE_URL,
        },
      },
    },
    routes: {
      "GET /": "packages/functions/src/lambda.handler",
      "GET /chats": { 
        function: "packages/functions/src/chats/getChats.main",
        authorizer: "none",
      },
      "Post /chats": "packages/functions/src/chats/createChat.main",
      "PUT /chats/{id}": "packages/functions/src/chats/updateChat.main",
      "DELETE /chats/{id}" : "packages/functions/src/chats/deleteChat.main",


      "GET /chats/{id}/messages": { 
        function: "packages/functions/src/messages/getMessages.main",
        authorizer: "none",
      },
      "POST /chats/{id}/messages": "packages/functions/src/messages/createMessage.main",
      "PUT /chats/{id}/messages/{messageId}": "packages/functions/src/messages/updateMessage.main",
      "DELETE /chats/{id}/messages/{messageId}": "packages/functions/src/messages/deleteMessage.main",


    },
  });
  
  // Allow authenticated users invoke API
  // And CRUD images
  auth.attachPermissionsForAuthUsers(stack, [
    api,
    new iam.PolicyStatement({
      actions: ["s3:GetObject", "s3:PutObject", "s3:DeleteObject"],
      effect: iam.Effect.ALLOW,
      resources: [
        bucket.bucketArn + "/public/*",
        bucket.bucketArn + "/private/${cognito-identity.amazonaws.com:sub}/*",
        bucket.bucketArn + "/protected/${cognito-identity.amazonaws.com:sub}/*",
      ]
    }),
    new iam.PolicyStatement({
      actions: ["s3:GetObject"],
      effect: iam.Effect.ALLOW,
      resources: [
        bucket.bucketArn + "/protected/*",
      ]
    })
  ]);

  // Allow unauthenticated users to access images
  auth.attachPermissionsForUnauthUsers(stack, [
    new iam.PolicyStatement({
      actions: ["s3:GetObject"],
      effect: iam.Effect.ALLOW,
      resources: [
        bucket.bucketArn + "/public/*",
        bucket.bucketArn + "/protected/*",
      ]
    })
  ]);

  stack.addOutputs({
    ApiEndpoint: api.url,
    UserPoolId: auth.userPoolId,
    IdentityPoolId: auth.cognitoIdentityPoolId ?? "",
    UserPoolClientId: auth.userPoolClientId,
  });

  return { api, auth }
}