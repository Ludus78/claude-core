'use client';

import { useState } from 'react';
import Link from 'next/link';
import { FaHome, FaListAlt, FaBookOpen, FaCalculator, FaMapMarkedAlt, FaUsers, FaChartLine } from 'react-icons/fa';
import { Disclosure } from '@headlessui/react';

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);

  const navigation = [
    { name: 'Accueil', href: '/', icon: FaHome },
    { name: 'Checklists', href: '/checklist', icon: FaListAlt },
    { name: 'Glossaire', href: '/glossary', icon: FaBookOpen },
    { name: 'Estimation', href: '/property-estimate', icon: FaChartLine },
    { name: 'Simulation de prêt', href: '/loan-calculator', icon: FaCalculator },
    { name: 'Quartiers', href: '/neighborhood-info', icon: FaMapMarkedAlt },
    { name: 'Professionnels', href: '/professional-directory', icon: FaUsers },
  ];

  return (
    <header className="bg-white shadow-md">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link href="/" className="text-2xl font-bold text-indigo-600">
                ImmoNova
              </Link>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="inline-flex items-center px-1 pt-1 border-b-2 border-transparent text-sm font-medium text-gray-500 hover:border-indigo-500 hover:text-gray-900"
                >
                  <item.icon className="h-4 w-4 mr-1" />
                  {item.name}
                </Link>
              ))}
            </div>
          </div>
          
          <div className="-mr-2 flex items-center sm:hidden">
            <Disclosure.Button 
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
              onClick={() => setIsOpen(!isOpen)}
            >
              <span className="sr-only">Open main menu</span>
              {isOpen ? (
                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </Disclosure.Button>
          </div>
        </div>
      </nav>

      {/* Mobile menu */}
      {isOpen && (
        <div className="sm:hidden">
          <div className="pt-2 pb-3 space-y-1">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="flex items-center px-3 py-2 border-l-4 border-transparent text-base font-medium text-gray-600 hover:bg-gray-50 hover:border-indigo-500 hover:text-gray-900"
                onClick={() => setIsOpen(false)}
              >
                <item.icon className="h-5 w-5 mr-3 text-gray-400" />
                {item.name}
              </Link>
            ))}
          </div>
        </div>
      )}
    </header>
  );
} 