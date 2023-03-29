import { createMessage } from "@chatapp/core/src/database"


export async function main(event){
    const username = event.requestContext.authorizer.iam?.cognitoIdentity?.username;
    const identityPoolUserId = event.requestContext.authorizer.iam?.cognitoIdentity?.identityId;
    const message = JSON.parse(event.body);
    const chat_id = message.chat_id;
    const id = event.pathParameters.id
    const {content, content_type} = JSON.parse(event.body);
    const newMessage = await createMessage(id, content, content_type, identityPoolUserId, "MPYawn");

    return {
        statusCode: 200,
        body: JSON.stringify({
            message: newMessage,
        }),
    };
}
