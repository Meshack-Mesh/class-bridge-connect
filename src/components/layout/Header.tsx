import { Button } from "@/components/ui/button";
import { GraduationCap, User, LogOut } from "lucide-react";
import { useState } from "react";

interface HeaderProps {
  user?: {
    name: string;
    role: 'student' | 'teacher' | 'admin';
    email: string;
  };
  onAuthAction: (action: 'login' | 'logout') => void;
}

export const Header = ({ user, onAuthAction }: HeaderProps) => {
  return (
    <header className="bg-card border-b shadow-[var(--shadow-card)] sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center space-x-2">
          <div className="p-2 bg-gradient-to-r from-primary to-accent rounded-lg">
            <GraduationCap className="h-6 w-6 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-foreground">EduConnect</h1>
            <p className="text-xs text-muted-foreground">Smart Education Platform</p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          <a href="#" className="text-foreground hover:text-primary transition-colors">
            Dashboard
          </a>
          <a href="#" className="text-foreground hover:text-primary transition-colors">
            Classes
          </a>
          <a href="#" className="text-foreground hover:text-primary transition-colors">
            Assignments
          </a>
          {user?.role === 'teacher' && (
            <a href="#" className="text-foreground hover:text-primary transition-colors">
              Manage
            </a>
          )}
        </nav>

        {/* User Actions */}
        <div className="flex items-center space-x-4">
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
                className="flex items-center space-x-1"
              >
                <LogOut className="h-4 w-4" />
                <span className="hidden sm:inline">Logout</span>
              </Button>
            </div>
          ) : (
            <Button 
              onClick={() => onAuthAction('login')}
              className="shadow-[var(--shadow-button)]"
            >
              <User className="h-4 w-4 mr-2" />
              Login
            </Button>
          )}
        </div>
      </div>
    </header>
  );
};