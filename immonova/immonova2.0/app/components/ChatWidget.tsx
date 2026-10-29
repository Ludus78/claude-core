"use client";

import { useState, useRef, useEffect } from "react";

type Message = {
    content: string;
    isUser: boolean;
    timestamp: number;
};

export default function ChatWidget() {
    const [isOpen, setIsOpen] = useState(false);
    const [inputValue, setInputValue] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [messages, setMessages] = useState<Message[]>([]);
    const chatRef = useRef<HTMLDivElement>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    // Gérer les clics en dehors du chat
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (chatRef.current && !chatRef.current.contains(event.target as Node)) {
                if (isOpen) setIsOpen(false);
            }
        }
        
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isOpen]);

    // Focus sur l'input quand le chat s'ouvre
    useEffect(() => {
        if (isOpen && inputRef.current) {
            inputRef.current.focus();
        }
    }, [isOpen]);

    // Scroll automatique vers le dernier message
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const handleSendMessage = async () => {
        if (!inputValue.trim()) return;

        const userMessage = inputValue;
        setMessages(prev => [...prev, { 
            content: userMessage, 
            isUser: true,
            timestamp: Date.now()
        }]);
        setIsLoading(true);
        setInputValue("");

        // Définir un timeout pour éviter une attente infinie en cas de problème
        const timeoutId = setTimeout(() => {
            if (isLoading) {
                setIsLoading(false);
                setMessages(prev => [...prev, { 
                    content: "Désolé, la réponse prend trop de temps. Veuillez réessayer dans quelques instants.", 
                    isUser: false,
                    timestamp: Date.now()
                }]);
            }
        }, 15000); // 15 secondes de timeout

        try {
            const controller = new AbortController();
            const signal = controller.signal;
            
            const response = await fetch("/api/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ 
                    message: userMessage,
                    history: messages.map(msg => msg.content)
                }),
                signal
            });

            clearTimeout(timeoutId); // Annuler le timeout si la réponse arrive à temps

            if (!response.ok) {
                throw new Error(`Erreur HTTP: ${response.status}`);
            }

            const data = await response.json();

            // Gérer le nouveau format de réponse
            let responseContent;
            if (!data.success) {
                responseContent = data.error;
            } else if (data.response) {
                responseContent = data.response;
            } else {
                throw new Error("Format de réponse inattendu");
            }

            // Vérifier si la réponse est vide ou trop courte
            if (!responseContent || responseContent.length < 10) {
                throw new Error("Réponse invalide");
            }

            // Vérifier si la réponse est identique à la dernière réponse
            const lastMessage = messages[messages.length - 1];
            if (lastMessage && 
                !lastMessage.isUser && 
                lastMessage.content === responseContent &&
                !responseContent.includes("Je suis spécialisé dans l'immobilier") &&
                !responseContent.includes("Je peux vous aider") &&
                !responseContent.includes("Je suis votre assistant immobilier")) {
                responseContent = "Je vois que vous reformulez votre question. Je vais essayer d'être plus précis : " + responseContent;
            }

            setMessages(prev => [...prev, { 
                content: responseContent, 
                isUser: false,
                timestamp: Date.now()
            }]);
        } catch (error) {
            console.error("Error:", error);
            clearTimeout(timeoutId); // Annuler le timeout en cas d'erreur
            
            // Message d'erreur plus convivial selon le type d'erreur
            let errorMessage = "Désolé, une erreur s'est produite. Veuillez réessayer.";
            
            if (error instanceof TypeError && error.message.includes('fetch')) {
                errorMessage = "Impossible de se connecter au serveur. Vérifiez votre connexion internet.";
            } else if (error instanceof Error && error.name === "AbortError") {
                errorMessage = "La requête a été annulée car elle prenait trop de temps.";
            }
            
            setMessages(prev => [...prev, { 
                content: errorMessage, 
                isUser: false,
                timestamp: Date.now()
            }]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    // Formatage de l'heure du message
    const formatTime = (timestamp: number) => {
        const date = new Date(timestamp);
        return `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
    };

    return (
        <div className="fixed bottom-6 right-6 z-50" ref={chatRef}>
            {/* Bouton de chat */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`
                    w-20 h-20 
                    bg-primary-600 
                    rounded-full 
                    shadow-lg 
                    flex items-center justify-center 
                    text-white 
                    hover:bg-primary-700 
                    transition-all duration-300 
                    focus:outline-none 
                    focus:ring-4 
                    focus:ring-primary-500 
                    focus:ring-offset-2
                    relative
                    animate-pulse
                    hover:animate-none
                    hover:scale-110
                    before:content-['']
                    before:absolute
                    before:inset-0
                    before:rounded-full
                    before:bg-primary-400
                    before:animate-ping
                    before:opacity-20
                `}
                aria-label={isOpen ? "Fermer le chat" : "Ouvrir le chat"}
            >
                {isOpen ? (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                    </svg>
                )}
            </button>

            {/* Fenêtre de chat */}
            {isOpen && (
                <div className="absolute bottom-20 right-0 w-96 max-h-[500px] bg-white rounded-lg shadow-xl flex flex-col overflow-hidden border border-gray-200 transition-all duration-300 transform origin-bottom-right">
                    {/* Header du chat */}
                    <div className="bg-primary-600 text-white p-4 flex items-center justify-between">
                        <div className="flex items-center">
                            <div className="h-10 w-10 bg-primary-700 rounded-full flex items-center justify-center mr-3">
                                <span className="text-lg font-bold">C</span>
                            </div>
                            <div>
                                <h3 className="font-semibold">Claude</h3>
                                <p className="text-xs text-primary-200">Assistant immobilier ImmoNova</p>
                            </div>
                        </div>
                    </div>

                    {/* Corps des messages */}
                    <div className="flex-grow p-4 overflow-y-auto bg-gray-50" style={{ maxHeight: "300px" }}>
                        {messages.length === 0 ? (
                            <div className="text-center text-gray-500 py-8">
                                <p>Bonjour, je suis Claude, votre assistant immobilier.</p>
                                <p className="mt-2">Comment puis-je vous aider aujourd'hui ?</p>
                            </div>
                        ) : (
                            messages.map((message, index) => (
                                <div 
                                    key={index} 
                                    className={`mb-4 flex ${message.isUser ? "justify-end" : "justify-start"}`}
                                >
                                    <div className={`max-w-[80%] rounded-lg p-3 ${
                                        message.isUser 
                                            ? "bg-primary-600 text-white" 
                                            : "bg-white text-gray-800 border border-gray-200"
                                    }`}>
                                        <div className="text-sm whitespace-pre-wrap">{message.content}</div>
                                        <div className={`text-xs mt-1 text-right ${
                                            message.isUser ? "text-primary-200" : "text-gray-500"
                                        }`}>
                                            {formatTime(message.timestamp)}
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                        
                        {/* Indicateur de chargement */}
                        {isLoading && (
                            <div className="flex justify-start mb-4">
                                <div className="bg-white text-gray-800 border border-gray-200 rounded-lg p-3 flex items-center">
                                    <div className="flex space-x-1">
                                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></div>
                                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></div>
                                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></div>
                                    </div>
                                </div>
                            </div>
                        )}
                        
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Zone de saisie */}
                    <div className="border-t border-gray-200 p-3 bg-white">
                        <div className="flex items-center">
                            <input
                                ref={inputRef}
                                type="text"
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                                onKeyPress={handleKeyPress}
                                placeholder="Écrivez votre message..."
                                className="flex-grow px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500"
                                disabled={isLoading}
                            />
                            <button
                                onClick={handleSendMessage}
                                disabled={isLoading || !inputValue.trim()}
                                className={`px-4 py-2 rounded-r-md ${
                                    isLoading || !inputValue.trim()
                                        ? "bg-gray-300 text-gray-500"
                                        : "bg-primary-600 text-white hover:bg-primary-700"
                                } transition-colors focus:outline-none`}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
                                </svg>
                            </button>
                        </div>
                        <div className="mt-2 text-xs text-gray-500 text-center">
                            <p>Claude recherche les informations sur le web pour vous apporter les meilleures réponses.</p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
