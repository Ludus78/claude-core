"use client";

import Link from 'next/link';
import { ReactNode } from 'react';
import Footer from './Footer';
import ChatWidget from './ChatWidget';
import {useKindeBrowserClient} from "@kinde-oss/kinde-auth-nextjs";
import {RegisterLink, LoginLink, LogoutLink} from "@kinde-oss/kinde-auth-nextjs/components";
import { XMarkIcon, UserIcon, ArrowRightOnRectangleIcon, PlusCircleIcon } from '@heroicons/react/24/outline';

interface SharedLayoutProps {
  children: ReactNode;
}

export default function SharedLayout({ children }: SharedLayoutProps) {
  const {isAuthenticated} = useKindeBrowserClient();

  return (
    <div className="flex flex-col min-h-screen overflow-y-auto bg-[#eef6ff] text-black">
      {/* Header/Navigation */}
      <header className="sticky top-0 z-50 bg-white py-4 px-6 shadow-sm">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center">
            <Link href="/" className="flex items-center hover:opacity-80">
              <div className="mr-2 text-2xl text-primary-700">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                  <path d="M11.47 3.84a.75.75 0 011.06 0l8.69 8.69a.75.75 0 101.06-1.06l-8.689-8.69a2.25 2.25 0 00-3.182 0l-8.69 8.69a.75.75 0 001.061 1.06l8.69-8.69z" />
                  <path d="M12 5.432l8.159 8.159c.03.03.06.058.091.086v6.198c0 1.035-.84 1.875-1.875 1.875H15a.75.75 0 01-.75-.75v-4.5a.75.75 0 00-.75-.75h-3a.75.75 0 00-.75.75V21a.75.75 0 01-.75.75H5.625a1.875 1.875 0 01-1.875-1.875v-6.198a2.29 2.29 0 00.091-.086L12 5.43z" />
                </svg>
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-bold text-primary-700">ImmoNova</span>
                <span className="block text-sm text-gray-500">Votre partenaire pour un investissement immobilier réussi</span>
              </div>
            </Link>
          </div>
          
          <nav className="hidden md:flex items-center gap-8">
            {/* Le lien Contact a été supprimé */}
          </nav>
          
           {isAuthenticated ? (
           <div className="flex items-center space-x-4">
            <Link 
              href="/dashboard" 
              className="px-4 py-2 font-medium text-primary-700 hover:text-primary-800 transition-colors"
            >
              Dashboard
            </Link>
            <LogoutLink className="px-4 py-2 border border-primary-600 rounded-lg font-medium text-primary-700 hover:bg-primary-50 transition-all">
              Déconnexion
            </LogoutLink>
           </div>
          ) : (
         <div className="flex items-center space-x-3">
           <LoginLink className="px-4 py-2 font-medium text-primary-700 hover:text-primary-800 transition-colors">
             Connexion
           </LoginLink>
           <RegisterLink className="px-4 py-2 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 transition-colors">
             Inscription
           </RegisterLink>
         </div>   
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow">
        {children}
      </main>
      
      {/* Footer */}
      <Footer />
      
      {/* Chat Widget */}
      <ChatWidget />
    </div>
  );
}

const MobileMenu = ({ isOpen, setIsOpen }: { isOpen: boolean, setIsOpen: (isOpen: boolean) => void }) => {
  const {isAuthenticated} = useKindeBrowserClient();
  
  if (!isOpen) return null;
  
  return (
    <div className="absolute inset-x-0 top-0 z-50 origin-top transform p-2 transition md:hidden">
      <div className="divide-y-2 divide-gray-50 rounded-lg bg-white shadow-lg ring-1 ring-black ring-opacity-5">
        <div className="px-5 pb-6 pt-5">
          <div className="flex items-center justify-between">
            <div className="inline-flex items-center space-x-2">
              <span className="font-bold text-xl text-primary-600">ImmoNova</span>
            </div>
            <div className="-mr-2">
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500"
              >
                <span className="sr-only">Close menu</span>
                <XMarkIcon className="h-6 w-6" aria-hidden="true" />
              </button>
            </div>
          </div>
          
          <div className="mt-6">
            <nav className="grid gap-y-4">
              {isAuthenticated ? (
                <>
                  <Link
                    href="/profil"
                    className="-m-3 flex items-center rounded-md p-3 hover:bg-gray-50"
                    onClick={() => setIsOpen(false)}
                  >
                    <UserIcon className="h-6 w-6 flex-shrink-0 text-primary-600" aria-hidden="true" />
                    <span className="ml-3 text-base font-medium text-gray-900">Mon Profil</span>
                  </Link>
                  <LogoutLink
                    className="-m-3 flex items-center rounded-md p-3 hover:bg-gray-50"
                  >
                    <ArrowRightOnRectangleIcon className="h-6 w-6 flex-shrink-0 text-primary-600" aria-hidden="true" />
                    <span className="ml-3 text-base font-medium text-gray-900">Déconnexion</span>
                  </LogoutLink>
                </>
              ) : (
                <>
                  <Link
                    href="/connexion"
                    className="-m-3 flex items-center rounded-md p-3 hover:bg-gray-50"
                    onClick={() => setIsOpen(false)}
                  >
                    <ArrowRightOnRectangleIcon className="h-6 w-6 flex-shrink-0 text-primary-600" aria-hidden="true" />
                    <span className="ml-3 text-base font-medium text-gray-900">Connexion</span>
                  </Link>
                  <Link
                    href="/inscription"
                    className="-m-3 flex items-center rounded-md p-3 hover:bg-gray-50"
                    onClick={() => setIsOpen(false)}
                  >
                    <PlusCircleIcon className="h-6 w-6 flex-shrink-0 text-primary-600" aria-hidden="true" />
                    <span className="ml-3 text-base font-medium text-gray-900">Inscription</span>
                  </Link>
                </>
              )}
            </nav>
          </div>
        </div>
      </div>
    </div>
  );
} 