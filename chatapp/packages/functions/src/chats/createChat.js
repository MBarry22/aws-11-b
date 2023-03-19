import { createChat } from "@chatapp/core/src/database";

export async function main(event){
    const name = JSON.parse(event.body);
    console.log(name);
    const chat = await createChat(name);
    return {
        statusCode: 200,
        body: JSON.stringify({
            chats: chat,
        }),
    };

}