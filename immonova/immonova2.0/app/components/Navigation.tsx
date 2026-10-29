"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function Navigation() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <nav className="bg-[var(--nav-bg)] shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <Image src="/logo.svg" alt="ImmoNova" width={40} height={40} className="mr-3" />
            <span className="text-white text-2xl font-bold font-['Montserrat']">ImmoNova</span>
          </Link>

          {/* Mobile menu button */}
          <button 
            className="md:hidden flex items-center text-white hover:opacity-75 focus:outline-none"
            onClick={toggleMobileMenu}
            aria-label="Toggle mobile menu"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              {mobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex space-x-4 items-center">
            <NavLink href="/">Accueil</NavLink>
            <NavLink href="/diagnostic">Diagnostic</NavLink>
            <NavLink href="/documents">Documents</NavLink>
            <NavLink href="/amelioration">Amélioration</NavLink>
            <NavLink href="/estimation">Estimation</NavLink>
            <NavLink href="/professionnels">Professionnels</NavLink>
            <NavLink href="/espaces-verts">Espaces Verts</NavLink>
            <NavLink href="/ecoles">Écoles</NavLink>
            <NavLink href="/frais-annexes">Frais Annexes</NavLink>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div 
          className={`md:hidden ${mobileMenuOpen ? 'block' : 'hidden'} mt-4 pt-2 border-t border-white/10`}
        >
          <div className="flex flex-col space-y-3">
            <MobileNavLink href="/" onClick={() => setMobileMenuOpen(false)}>Accueil</MobileNavLink>
            <MobileNavLink href="/diagnostic" onClick={() => setMobileMenuOpen(false)}>Diagnostic</MobileNavLink>
            <MobileNavLink href="/documents" onClick={() => setMobileMenuOpen(false)}>Documents</MobileNavLink>
            <MobileNavLink href="/amelioration" onClick={() => setMobileMenuOpen(false)}>Amélioration</MobileNavLink>
            <MobileNavLink href="/estimation" onClick={() => setMobileMenuOpen(false)}>Estimation</MobileNavLink>
            <MobileNavLink href="/professionnels" onClick={() => setMobileMenuOpen(false)}>Professionnels</MobileNavLink>
            <MobileNavLink href="/espaces-verts" onClick={() => setMobileMenuOpen(false)}>Espaces Verts</MobileNavLink>
            <MobileNavLink href="/ecoles" onClick={() => setMobileMenuOpen(false)}>Écoles</MobileNavLink>
            <MobileNavLink href="/frais-annexes" onClick={() => setMobileMenuOpen(false)}>Frais Annexes</MobileNavLink>
          </div>
        </div>
      </div>
    </nav>
  );
}

// Composant pour les liens de navigation desktop
function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link 
      href={href} 
      className="nav-link text-white font-['Nunito'] font-medium hover:text-white/90 transition-colors"
    >
      {children}
    </Link>
  );
}

// Composant pour les liens de navigation mobile
function MobileNavLink({ href, onClick, children }: { href: string; onClick: () => void; children: React.ReactNode }) {
  return (
    <Link 
      href={href} 
      className="py-2 px-3 text-white font-['Nunito'] hover:bg-white/10 rounded transition-colors block"
      onClick={onClick}
    >
      {children}
    </Link>
  );
} 