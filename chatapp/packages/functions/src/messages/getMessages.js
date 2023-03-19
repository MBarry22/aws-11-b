import { getMessages } from "@chatapp/core/src/database"


export async function main(event){
    const messages = await getMessages();
    return {
        statusCode: 200,
        body: JSON.stringify({
            messages: messages,
        }),
    };

}