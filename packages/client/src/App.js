import "./App.css";
import { Routes, Route } from "react-router-dom";

import PrivateRoute from "./Components/PrivateRoute/PrivateRoute";
import Login from "./Views/Onboarding/Login/Login";
import Register from "./Views/Onboarding/Register/Register";
import Chat from "./Views/Chat/Chat";

const App = () => {
   return (
      <div className="App">
         <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/sign-up" element={<Register />} />
            <Route
               path="/realtime-chat"
               element={
                  <PrivateRoute>
                     <Chat />
                  </PrivateRoute>
               }
            />
         </Routes>
      </div>
   );
};

export default App;
