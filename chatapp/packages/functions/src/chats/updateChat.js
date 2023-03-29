import { updateChat } from "@chatapp/core/src/database";

function getUserId(event) {
  if (!event.requestContext.authorizer?.iam) {
    return 
  }
  const authProvider = event.requestContext.authorizer.iam.cognitoIdentity.amr.findLast(ref => ref.includes(':'))
  const parts = authProvider.split(':');
  return parts[parts.length - 1];
}


export async function main(event) {
  const userId = getUserId(event);
  const id = event.pathParameters.id;
  const { name } = JSON.parse(event.body);
  const updatedChat = await updateChat(id, name, userId);
  return {
    statusCode: 200,
    body: JSON.stringify({
      //chat: updatedChat,
      userId: userId,
    }),
  };
}