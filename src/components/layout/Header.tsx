import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { GraduationCap, User, LogOut, Menu } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

interface HeaderProps {
  user?: {
    name: string;
    role: 'student' | 'teacher' | 'admin';
    email: string;
  };
  onAuthAction: (action: 'login' | 'logout') => void;
}

export const Header = ({ user, onAuthAction }: HeaderProps) => {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  const isActive = (path: string) => {
    if (path === '/dashboard' && location.pathname === '/') return true;
    return location.pathname === path;
  };

  return (
    <header className="bg-card border-b shadow-[var(--shadow-card)] sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link to={user ? "/dashboard" : "/"} className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
          <div className="p-2 bg-gradient-to-r from-primary to-accent rounded-lg">
            <GraduationCap className="h-6 w-6 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-foreground">EduConnect</h1>
            <p className="text-xs text-muted-foreground">Smart Education Platform</p>
          </div>
        </Link>

        {/* Navigation */}
        {user && (
          <nav className="hidden md:flex items-center space-x-6">
            <Link 
              to="/dashboard" 
              className={`text-foreground hover:text-primary transition-colors ${
                isActive('/dashboard') ? 'text-primary font-medium' : ''
              }`}
            >
              Dashboard
            </Link>
            <Link 
              to="/classes" 
              className={`text-foreground hover:text-primary transition-colors ${
                isActive('/classes') ? 'text-primary font-medium' : ''
              }`}
            >
              Classes
            </Link>
            <Link 
              to="/assignments" 
              className={`text-foreground hover:text-primary transition-colors ${
                isActive('/assignments') ? 'text-primary font-medium' : ''
              }`}
            >
              Assignments
            </Link>
            {user.role === 'student' && (
              <Link 
                to="/announcements" 
                className={`text-foreground hover:text-primary transition-colors ${
                  isActive('/announcements') ? 'text-primary font-medium' : ''
                }`}
              >
                Announcements
              </Link>
            )}
            <Link 
              to="/profile" 
              className={`text-foreground hover:text-primary transition-colors ${
                isActive('/profile') ? 'text-primary font-medium' : ''
              }`}
            >
              Profile
            </Link>
          </nav>
        )}

        {/* User Actions */}
        <div className="flex items-center space-x-4">
          {/* Mobile Menu */}
          {user && (
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="sm" className="md:hidden">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px]">
                <div className="flex flex-col space-y-4 mt-8">
                  <Link 
                    to="/dashboard" 
                    className={`text-foreground hover:text-primary transition-colors p-3 rounded-lg ${
                      isActive('/dashboard') ? 'text-primary bg-primary/10 font-medium' : ''
                    }`}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Dashboard
                  </Link>
                  <Link 
                    to="/classes" 
                    className={`text-foreground hover:text-primary transition-colors p-3 rounded-lg ${
                      isActive('/classes') ? 'text-primary bg-primary/10 font-medium' : ''
                    }`}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Classes
                  </Link>
                  <Link 
                    to="/assignments" 
                    className={`text-foreground hover:text-primary transition-colors p-3 rounded-lg ${
                      isActive('/assignments') ? 'text-primary bg-primary/10 font-medium' : ''
                    }`}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Assignments
                  </Link>
                  {user.role === 'student' && (
                    <Link 
                      to="/announcements" 
                      className={`text-foreground hover:text-primary transition-colors p-3 rounded-lg ${
                        isActive('/announcements') ? 'text-primary bg-primary/10 font-medium' : ''
                      }`}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Announcements
                    </Link>
                  )}
                  <Link 
                    to="/profile" 
                    className={`text-foreground hover:text-primary transition-colors p-3 rounded-lg ${
                      isActive('/profile') ? 'text-primary bg-primary/10 font-medium' : ''
                    }`}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Profile
                  </Link>
                  
                  <div className="pt-4 border-t">
                    <div className="text-center mb-4">
                      <p className="text-sm font-medium text-foreground">{user.name}</p>
                      <p className="text-xs text-muted-foreground capitalize">{user.role}</p>
                    </div>
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={() => {
                        onAuthAction('logout');
                        setMobileMenuOpen(false);
                      }}
                    >
                      <LogOut className="h-4 w-4 mr-2" />
                      Logout
                    </Button>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          )}

          {user ? (
            <div className="flex items-center space-x-2">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-medium text-foreground">{user.name}</p>
                <p className="text-xs text-muted-foreground capitalize">{user.role}</p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onAuthAction('logout')}
                className="hidden md:flex items-center space-x-1"
              >
                <LogOut className="h-4 w-4" />
                <span className="hidden sm:inline">Logout</span>
              </Button>
            </div>
          ) : null}
        </div>
      </div>
    </header>
  );
};