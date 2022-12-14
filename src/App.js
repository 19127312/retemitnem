import { useEffect } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Routes, Route } from "react-router-dom";
import LoginPage from "./Components/AuthPage/LoginPage";
import PrivateRoutes from "./Components/RoutesChecking/PrivateRoutes";
import SingupPage from "./Components/AuthPage/SignupPage";
import CheckingAuthRoutes from "./Components/RoutesChecking/CheckingAuthRoutes";
import MainPage from "./Components/MainPage/MainPage";
import GroupPage from "./Components/GroupPage/GroupPage";
import SlidePage from "./Components/SlidePage/Slide/SlidePage";
import JoinLink from "./Components/JoinLink";
import ResetPassword from "./Components/AuthPage/ResetPassword";
import PresentationMemberPage from "./Components/SlidePage/Slide/PresentationMemberPage";
import { SocketProvider } from "./Context/SocketProvider";

const queryClient = new QueryClient();
function App() {
  useEffect(() => {
    document.title = "Retemitnem";
  }, []);
  return (
    <QueryClientProvider client={queryClient}>
      <Routes>
        <Route element={<CheckingAuthRoutes />}>
          <Route path="login" element={<LoginPage />} />
          <Route path="register" element={<SingupPage />} />
        </Route>

        <Route element={<PrivateRoutes />}>
          <Route path="/" element={<MainPage />} />
          <Route
            path="/group/:id"
            element={
              <SocketProvider>
                <GroupPage />
              </SocketProvider>
            }
          />
          <Route
            path="/slide/:id"
            element={
              <SocketProvider>
                <SlidePage />
              </SocketProvider>
            }
          />
        </Route>
        <Route
          path="/presentation/:id"
          element={
            <SocketProvider>
              <PresentationMemberPage />
            </SocketProvider>
          }
        />
        <Route path="/joinlink/:id" element={<JoinLink />} />
        <Route path="/resetpassword/:id" element={<ResetPassword />} />
        <Route path="*" element={<div>404</div>} />
      </Routes>
    </QueryClientProvider>
  );
}

export default App;
