import { useAuth } from "@/context/AuthContext";
import { Header } from "./Header";
import { useNavigate } from "react-router-dom";

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout = ({ children }: LayoutProps) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleAuthAction = async (action: 'login' | 'logout') => {
    if (action === 'logout') {
      await logout();
      navigate('/');
    } else {
      navigate('/');
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header user={user} onAuthAction={handleAuthAction} />
      <main>{children}</main>
    </div>
  );
};