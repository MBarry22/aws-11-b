import { createMessage } from "@chatapp/core/src/database"


export async function main(event){
    const message = JSON.parse(event.body);
    const chat_id = message.chat_id; // Extract chat_id from message
    const content = message.content; // Extract content from message

    const newMessage = await createMessage(chat_id, content);

    return {
        statusCode: 200,
        body: JSON.stringify({
            message: newMessage,
        }),
    };
}
