import { deleteChat } from "@chatapp/core/src/database";
export async function main(event){
    const id = event.pathParameters.id;
    const deleted = await deleteChat(id);
    return {
        statusCode: 200,
        body: JSON.stringify({
            chat: deleted,
        }),
    };

}