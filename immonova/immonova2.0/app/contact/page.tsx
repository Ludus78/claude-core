'use client';

import { useState } from 'react';
import { IoMailOutline, IoCallOutline, IoPersonOutline, IoDocumentTextOutline, IoBusinessOutline, IoWalletOutline, IoSendOutline } from 'react-icons/io5';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    projectType: '',
    budget: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          budget: parseInt(formData.budget) || 0,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to submit form');
      }

      // Reset form after successful submission
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        projectType: '',
        budget: '',
        message: ''
      });
      setSubmitSuccess(true);
      setTimeout(() => setSubmitSuccess(false), 5000);
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to send message');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const projectTypes = [
    { value: '', label: 'Sélectionnez un type de projet' },
    { value: 'main_residence', label: 'Achat résidence principale' },
    { value: 'secondary_residence', label: 'Achat résidence secondaire' },
    { value: 'investment', label: 'Investissement immobilier' },
    { value: 'land_construction', label: 'Achat de terrain + construction' },
    { value: 'rental', label: 'Mise en location' },
    { value: 'resale', label: 'Revente d\'un bien' },
    { value: 'other', label: 'Autre projet' },
  ];

  return (
    <div className="bg-gradient-to-br from-gray-50 to-white py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl mb-4">
            Contactez-nous
          </h1>
          <div className="h-1 w-20 bg-primary-600 mx-auto rounded-full mb-6"></div>
          <p className="max-w-2xl mx-auto text-lg text-gray-600">
            Nous sommes à votre écoute pour vous accompagner dans votre projet immobilier
          </p>
        </div>

        {submitSuccess ? (
          <div className="bg-white shadow-xl rounded-xl p-8 md:p-10 text-center max-w-lg mx-auto transform transition-all duration-500 scale-100 translate-y-0 opacity-100">
            <div className="w-16 h-16 bg-green-100 mx-auto rounded-full flex items-center justify-center mb-6">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Message envoyé avec succès!</h2>
            <p className="text-gray-600 mb-6">
              Merci de nous avoir contactés. Notre équipe vous répondra dans les plus brefs délais.
            </p>
            <button
              onClick={() => setSubmitSuccess(false)}
              className="px-6 py-3 bg-primary-600 text-white rounded-lg shadow-md hover:bg-primary-700 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              Envoyer un autre message
            </button>
          </div>
        ) : (
          <form 
            onSubmit={handleSubmit}
            className="bg-white shadow-xl rounded-xl overflow-hidden transition-all duration-300 transform hover:shadow-2xl"
          >
            <div className="p-8 md:p-10">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Informations personnelles */}
                <div className="md:col-span-2">
                  <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                    <span className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center mr-3">
                      <IoPersonOutline className="text-primary-600 w-5 h-5" />
                    </span>
                    Vos informations
                  </h2>
                </div>
                
                {/* Nom */}
                <div className="group">
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                    Nom complet*
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <IoPersonOutline className="h-5 w-5 text-gray-400 group-focus-within:text-primary-500" />
                    </div>
                    <input
                      type="text"
                      name="name"
                      id="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Votre nom"
                      className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-primary-500 focus:border-primary-500 transition-all duration-200"
                      required
                    />
                  </div>
                </div>
                
                {/* Email */}
                <div className="group">
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email*
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <IoMailOutline className="h-5 w-5 text-gray-400 group-focus-within:text-primary-500" />
                    </div>
                    <input
                      type="email"
                      name="email"
                      id="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="Votre email"
                      className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-primary-500 focus:border-primary-500 transition-all duration-200"
                      required
                    />
                  </div>
                </div>
                
                {/* Téléphone */}
                <div className="group">
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                    Téléphone
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <IoCallOutline className="h-5 w-5 text-gray-400 group-focus-within:text-primary-500" />
                    </div>
                    <input
                      type="tel"
                      name="phone"
                      id="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="Votre téléphone"
                      className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-primary-500 focus:border-primary-500 transition-all duration-200"
                    />
                  </div>
                </div>
                
                {/* Sujet */}
                <div className="group">
                  <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">
                    Sujet*
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <IoDocumentTextOutline className="h-5 w-5 text-gray-400 group-focus-within:text-primary-500" />
                    </div>
                    <input
                      type="text"
                      name="subject"
                      id="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      placeholder="Sujet de votre message"
                      className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-primary-500 focus:border-primary-500 transition-all duration-200"
                      required
                    />
                  </div>
                </div>
                
                {/* Informations projet */}
                <div className="md:col-span-2 mt-4">
                  <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                    <span className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center mr-3">
                      <IoBusinessOutline className="text-primary-600 w-5 h-5" />
                    </span>
                    Votre projet immobilier
                  </h2>
                </div>
                
                {/* Type de projet */}
                <div className="group">
                  <label htmlFor="projectType" className="block text-sm font-medium text-gray-700 mb-1">
                    Type de projet
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <IoBusinessOutline className="h-5 w-5 text-gray-400 group-focus-within:text-primary-500" />
                    </div>
                    <select
                      name="projectType"
                      id="projectType"
                      value={formData.projectType}
                      onChange={handleChange}
                      className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-primary-500 focus:border-primary-500 transition-all duration-200 appearance-none"
                    >
                      {projectTypes.map(type => (
                        <option key={type.value} value={type.value}>
                          {type.label}
                        </option>
                      ))}
                    </select>
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                      <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 20 20" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M6 8l4 4 4-4" />
                      </svg>
                    </div>
                  </div>
                </div>
                
                {/* Budget */}
                <div className="group">
                  <label htmlFor="budget" className="block text-sm font-medium text-gray-700 mb-1">
                    Budget (€)
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <IoWalletOutline className="h-5 w-5 text-gray-400 group-focus-within:text-primary-500" />
                    </div>
                    <input
                      type="number"
                      name="budget"
                      id="budget"
                      value={formData.budget}
                      onChange={handleChange}
                      placeholder="Votre budget"
                      className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-primary-500 focus:border-primary-500 transition-all duration-200"
                    />
                  </div>
                </div>
                
                {/* Message */}
                <div className="md:col-span-2 group">
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                    Message*
                  </label>
                  <textarea
                    name="message"
                    id="message"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Décrivez votre projet ou votre demande..."
                    rows={6}
                    className="block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-primary-500 focus:border-primary-500 transition-all duration-200"
                    required
                  ></textarea>
                </div>
              </div>
            </div>
            
            {/* Footer with submit button */}
            <div className="px-8 md:px-10 py-5 bg-gray-50 border-t border-gray-100 flex justify-end">
              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-lg shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-all duration-300 transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Envoi en cours...
                  </>
                ) : (
                  <>
                    <IoSendOutline className="mr-2 h-5 w-5" />
                    Envoyer le message
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}