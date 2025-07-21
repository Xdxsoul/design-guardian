import { Button } from "@/components/ui/button";
import { Palette, User as _User, LogOut, Menu, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useState } from "react";
import { User } from "../declarations/main/main.did"

interface NavbarProps {
  user?: User;
  onNavigate: (page: string) => void;
  onLogout?: () => void;
}

export const Navbar = ({ user, onNavigate, onLogout }: NavbarProps) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { theme, setTheme } = useTheme();

  const navigationItems = [
    { label: "Dashboard", page: "dashboard" },
    { label: "Design Studio", page: "design" },
    { label: "Gallery", page: "gallery" },
  ];

  const NavLinks = ({ mobile = false }) => (
    <>
      {navigationItems.map((item) => (
        <Button
          key={item.page}
          variant="ghost"
          onClick={() => {
            onNavigate(item.page);
            if (mobile) setMobileMenuOpen(false);
          }}
          className={`${mobile ? 'w-full justify-start' : ''}`}
        >
          {item.label}
        </Button>
      ))}
    </>
  );

  return (
    <nav className="border-b bg-card shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <div className="bg-gradient-to-r from-primary to-primary-glow p-2 rounded-lg shadow-lg">
              <Palette className="h-6 w-6 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
              Design Guardian
            </span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            {user && <NavLinks />}
          </div>

          {/* User Menu */}
          <div className="flex items-center space-x-4">
            {user ? (
              <>
                {/* Mobile Menu */}
                <div className="md:hidden">
                  <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
                    <SheetTrigger asChild>
                      <Button variant="outline" size="icon">
                        <Menu className="h-4 w-4" />
                      </Button>
                    </SheetTrigger>
                    <SheetContent side="right">
                      <div className="flex flex-col space-y-4 mt-8">
                        <NavLinks mobile />
                      </div>
                    </SheetContent>
                  </Sheet>
                </div>

                {/* User Dropdown */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="flex items-center space-x-2">
                      <_User className="h-4 w-4" />
                      <span className="hidden sm:block">{user.name}</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56 bg-popover border shadow-lg">
                    <DropdownMenuItem onClick={() => onNavigate('profile')}>
                      <_User className="mr-2 h-4 w-4" />
                      Profile
                    </DropdownMenuItem>
                    {onLogout && (
                      <DropdownMenuItem onClick={onLogout}>
                        <LogOut className="mr-2 h-4 w-4" />
                        Logout
                      </DropdownMenuItem>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <div className="flex items-center space-x-2">
                <Button variant="outline" onClick={() => onNavigate('login')}>
                  Login
                </Button>
                <Button onClick={() => onNavigate('register')}>
                  Register
                </Button>
              </div>
            )}
            
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="ml-4"
            >
              {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
};