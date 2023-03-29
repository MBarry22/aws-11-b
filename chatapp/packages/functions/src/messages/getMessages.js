import { getMessages } from "@chatapp/core/src/database"


export async function main(event){
    const { id } = event.pathParameters;
    const messages = await getMessages(id);
    return {
        statusCode: 200,
        body: JSON.stringify({
            messages: messages,
        }),
    };

}