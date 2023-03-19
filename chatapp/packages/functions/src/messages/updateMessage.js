import { updateMessage } from "@chatapp/core/src/database";

export async function main(event) {
  const { id, chat_id, content } = JSON.parse(event.body);
  const updatedMessage = await updateMessage(id, chat_id, content);
  return {
    statusCode: 200,
    body: JSON.stringify({
      message: updatedMessage,
    }),
  };
}
