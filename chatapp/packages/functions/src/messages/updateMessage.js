import { updateMessage } from "@chatapp/core/src/database";

export async function main(event) {
  const sub = event.requestContext.authorizer?.jwt.claims.sub;
  console.log(sub);
  const username = event.requestContext.authorizer?.jwt.claims.username;
  console.log(username);

  const { id, content, chat_id } = JSON.parse(event.body);
  const updatedMessage = await updateMessage(id, content, sub, username, chat_id);
  return {
    statusCode: 200,
    body: JSON.stringify({
      message: updatedMessage,
    }),
  };
}
