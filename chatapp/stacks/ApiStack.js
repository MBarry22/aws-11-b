import { Api } from "sst/constructs";

export function API({ stack }) {
  const api = new Api(stack, "api", {
    defaults: {
      function: {
        environment: {
          // Pass in our environment variables
          DATABASE_URL: process.env.DATABASE_URL,
        },
      },
    },

    routes: {
      "GET /": "packages/functions/src/lambda.handler",
      "GET /chats": "packages/functions/src/chats/getChats.main",
      "POST /chats": "packages/functions/src/chats/createChat.main",
      "PUT /chats/{id}": "packages/functions/src/chats/updateChat.main",
      "DELETE /chats/{id}": "packages/functions/src/chats/deleteChat.main",

      "GET /chats/{id}/messages": "packages/functions/src/messages/getMessages.main",
      "POST /chats/{id}/messages": "packages/functions/src/messages/createMessage.main",
      "PUT /chats/{id}/messages/{messageId}": "packages/functions/src/messages/updateMessage.main",
      "DELETE /chats/{id}/messages/{messageId}": "packages/functions/src/messages/deleteMessage.main",
    },
  });
  stack.addOutputs({
    ApiEndpoint: api.url,
  });

  return { api };
}
