import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import eyeterraIcon from '@/assets/eyeterra-icon.png';
import AccessibilityDropdown from './AccessibilityDropdown';

// Nav links defined locally to keep the header self-contained
const navLinks = [
  { name: 'Home', path: '/' },
  { name: 'Daily Habits', path: '/daily-habits' },
  { name: 'Awareness Hub', path: '/awareness' },
  { name: 'Vision Tour', path: '/vision-tour' },
  { name: 'Find Eye Care', path: '/find-care' },
];

const EyeterraIcon = () => (
  <img
    src={eyeterraIcon}
    alt="Eyeterra logo"
    className="w-8 h-8 no-hc-invert"
    aria-hidden="true" />
);

const MenuIcon = () => (
  <svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden="true">
    <rect x="2" y="5" width="18" height="2" fill="currentColor" />
    <rect x="2" y="10" width="18" height="2" fill="currentColor" />
    <rect x="2" y="15" width="18" height="2" fill="currentColor" />
  </svg>
);

const Header: React.FC = () => {
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-background border-b-2 border-border">
      <div className="max-w-7xl mx-auto px-4 md:px-8 h-14 flex items-center justify-between gap-4">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 shrink-0" aria-label="Eyeterra home">
          <EyeterraIcon />
          <span className="font-bold text-lg text-foreground tracking-tight">Eyeterra</span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden lg:flex items-center gap-1" aria-label="Main navigation">
          {navLinks.map(link => (
            <Link
              key={link.path}
              to={link.path}
              className={`px-3 py-1.5 text-sm font-medium border-2 transition-colors ${
                location.pathname === link.path
                  ? 'bg-primary text-primary-foreground border-primary'
                  : 'text-foreground border-transparent hover:border-border hover:bg-accent'
              }`}
            >
              {link.name}
            </Link>
          ))}
        </nav>

        {/* Right side */}
        <div className="flex items-center gap-2 shrink-0">
          <AccessibilityDropdown />
          {/* Mobile menu */}
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="lg:hidden text-foreground"
                aria-label="Open menu"
              >
                <MenuIcon />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="bg-sidebar w-72 p-0">
              <div className="flex items-center justify-between px-4 h-14 border-b-2 border-sidebar-border">
                <Link to="/" className="flex items-center gap-2" onClick={() => setMobileOpen(false)}>
                  <EyeterraIcon />
                  <span className="font-bold text-lg text-sidebar-foreground">Eyeterra</span>
                </Link>
              </div>
              <nav className="flex flex-col p-4 gap-1" aria-label="Mobile navigation">
                {navLinks.map(link => (
                  <Link
                    key={link.path}
                    to={link.path}
                    onClick={() => setMobileOpen(false)}
                    className={`px-4 py-3 text-base font-medium border-2 transition-colors ${
                      location.pathname === link.path
                        ? 'bg-primary text-primary-foreground border-primary'
                        : 'text-sidebar-foreground border-transparent hover:bg-sidebar-accent hover:border-sidebar-border'
                    }`}
                  >
                    {link.name}
                  </Link>
                ))}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
};

export default Header;
