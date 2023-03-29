import { useAuthenticator } from '@aws-amplify/ui-react';

export default function Profile () {
  const { user, signOut } = useAuthenticator((context) => [context.user]);
  return (
    <div>
        <h1>Profile</h1>
        <p>Username: {user.username}</p>
        <p>Email: {user.attributes.email}</p>
        <button onClick={signOut}>Sign Out</button>
    </div>
    
  );
}   