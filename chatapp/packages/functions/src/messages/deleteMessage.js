import { deleteMessage } from "@chatapp/core/src/database"

export async function main(event) {
  try {
    const { id, messageId } = event.pathParameters;

    const deleted = await deleteMessage(messageId);

    return {
      statusCode: 200,
      body: JSON.stringify({ message: deleted }),
    };
  } catch (err) {
    console.error(err);

    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Internal Server Error" }),
    };
  }
}
