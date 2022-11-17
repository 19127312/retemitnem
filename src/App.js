
import LoginPage from './Components/AuthPage/LoginPage';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Routes, Route, useNavigate } from 'react-router-dom';
import PrivateRoutes from './Components/RoutesChecking/PrivateRoutes';
import SingupPage from "./Components/AuthPage/SignupPage"
import CheckingAuthRoutes from './Components/RoutesChecking/CheckingAuthRoutes';
import MainPage from './Components/MainPage/MainPage';
const queryClient = new QueryClient()
function App() {

  return (
    <QueryClientProvider client={queryClient}>

      <Routes>

        <Route element={<CheckingAuthRoutes />} >
          <Route path="login" element={<LoginPage />} />
          <Route path="register" element={<SingupPage />} />
        </Route>

        <Route element={<PrivateRoutes />} >
          <Route path="/" element={<MainPage />} />

        </Route>

        <Route path="*" element={<div>404</div>} />

      </Routes>

    </QueryClientProvider>
  );
}

export default App;
