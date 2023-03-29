import { createChat } from "@chatapp/core/src/database";


   

export async function main(event){
    const username = event.requestContext.authorizer.iam?.cognitoIdentity?.username;
    const identityPoolUserId = event.requestContext.authorizer.iam?.cognitoIdentity?.identityId
    const { name } = JSON.parse(event.body);

    console.log(name);
    const chat = await createChat(name, identityPoolUserId, "mpyawn");
    return {
        statusCode: 200,
        body: JSON.stringify({
            chats: chat,
            
        }),
    };

}

