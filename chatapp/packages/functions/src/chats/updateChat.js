import { updateChat } from "@chatapp/core/src/database";

export async function main(event) {
  const { id, name } = JSON.parse(event.body);
  const updatedChat = await updateChat(id, name);
  return {
    statusCode: 200,
    body: JSON.stringify({
      chat: updatedChat,
    }),
  };
}
