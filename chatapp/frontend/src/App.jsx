import { BrowserRouter, Link, Route, Routes } from "react-router-dom";
import { Amplify } from "aws-amplify";
import { Authenticator } from "@aws-amplify/ui-react";
import { useAuthenticator } from "@aws-amplify/ui-react";

import ChatGPT from "./ChatGPT/ChatGPT";
import Login from "./Login";
import Profile from "./Profile";

import RouteGuard from "./ChatGPT/RouteGuard";


const amplifyConfig = {
  Auth: {
    mandatorySignIn: false,
    region: import.meta.env.VITE_APP_REGION,
    userPoolId: import.meta.env.VITE_APP_USER_POOL_ID,
    userPoolWebClientId: import.meta.env.VITE_APP_USER_POOL_CLIENT_ID,
    identityPoolId: import.meta.env.VITE_APP_IDENTITY_POOL_ID,
  },
  API: {
    endpoints: [
      {
        name: "api",
        endpoint: import.meta.env.VITE_API_URL,
        region: import.meta.env.VITE_APP_REGION,
      },
    ],
  },
  Storage: {
    AWSS3: {
      bucket: import.meta.env.VITE_APP_S3_BUCKET_NAME,
      region: import.meta.env.VITE_APP_REGION,
      level: "protected",
    },
  },
};
Amplify.configure(amplifyConfig);
console.log(amplifyConfig);
function NavBar() {
  const { user } = useAuthenticator((context) => [context.user]);
  return(
  <nav className="bg-slate-700 text-white">
    <ul className="flex items-center justify-between p-4">
      <li>
        <Link to="/">Chat</Link>
      </li>
      {user ? 
    <li>
    <Link to="/profile">Profile</Link>
  </li>
    :
    <li>
      <Link to="/login">Login</Link>
    </li>

      }
    </ul>
  </nav>
  );
}

export default function App() {
  return (
    <Authenticator.Provider>
      <BrowserRouter>
      <NavBar></NavBar>
          <Routes>
            <Route path="/" element={<ChatGPT />} />
            <Route path="/login" element={<Login />} />
            <Route path="/profile" element={<RouteGuard><Profile /></RouteGuard>} />
          </Routes>
      </BrowserRouter>
    </Authenticator.Provider>
  );
}
