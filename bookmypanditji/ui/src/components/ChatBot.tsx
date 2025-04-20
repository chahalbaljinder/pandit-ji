'use client';

import { useState, useRef, useEffect } from 'react';

type Message = {
  id: number;
  text: string;
  isUser: boolean;
  timestamp: Date;
};

// Extended pre-defined responses for the AI chatbot
const botResponses = {
  greeting: [
    "Namaste! How can I assist you with your puja or pandit booking today?",
    "Welcome to BookMyPanditJi! I'm here to help you find the perfect pandit for your ceremony.",
    "Namaste! Looking for religious services or a pandit? I can help!"
  ],
  services: [
    "We offer various services including Griha Pravesh, Satyanarayan Puja, Wedding Ceremonies, Baby Naming Ceremonies, and many more. Would you like to know details about any specific service?",
    "Our pandits can perform many ceremonies such as Griha Pravesh, Vastu Puja, Satyanarayan Puja, Wedding rituals, and more. Which one are you interested in?"
  ],
  booking: [
    "You can book a pandit by selecting the service type, location, and preferred date. Would you like me to guide you through the booking process?",
    "To book a pandit, you can use our normal advance booking or premium urgent booking options. Would you like to proceed with booking now?"
  ],
  locations: [
    "Our pandits provide services across major cities including Delhi, Mumbai, Bangalore, and many more. Where do you need the service?",
    "We have verified pandits available in most major cities across India. Where are you located?"
  ],
  samagri: [
    "Yes, we provide puja samagri (materials) for all ceremonies. You can add them to your cart during the booking process. Would you like to only order samagri without booking a pandit?",
    "We can arrange all required puja samagri for your ceremony. Would you like to know more about our samagri packages?"
  ],
  darshan: [
    "Yes, we offer live darshan services from major temples across India. Would you like to check out the live darshan feature?",
    "Our platform provides live darshan from various important temples. You can access it from our Live Darshan section."
  ],
  panchang: [
    "Today's Panchang shows it's an auspicious day for starting new ventures. Would you like to book a puja accordingly?",
    "According to today's Panchang, it's a good day for family gatherings and ceremonies. Would you like to see available pandits?"
  ],
  festivals: [
    "The upcoming festival is Diwali on November 12th. Would you like to book a pandit for Lakshmi Puja?",
    "Navratri is coming up next month. We offer special puja packages for all nine days. Would you like more information?"
  ],
  urgentBooking: [
    "Our premium booking service allows you to book a pandit on short notice, even within a few hours. Would you like to proceed with urgent booking?",
    "We understand emergency situations. Our premium service can arrange a qualified pandit within hours. Would you like to make an urgent booking?"
  ],
  fallback: [
    "I'm not sure I understand. Could you please rephrase your question?",
    "I apologize, but I don't have enough information about that. Could you provide more details?",
    "Let me connect you with our customer support team for better assistance. You can call us at +91-XXXXXXXXXX."
  ]
};

// Extended quick suggestions for users
const quickSuggestions = [
  "How to book a pandit?",
  "What services do you offer?",
  "Do you provide puja samagri?",
  "Live temple darshan",
  "Urgent puja booking",
  "Today's panchang details",
  "Upcoming festivals"
];

export default function ChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(true);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Load chat history from localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedMessages = localStorage.getItem('chatHistory');
      if (savedMessages && JSON.parse(savedMessages).length > 0) {
        try {
          const parsedMessages = JSON.parse(savedMessages).map((msg: any) => ({
            ...msg,
            timestamp: new Date(msg.timestamp)
          }));
          setMessages(parsedMessages);
        } catch (error) {
          console.error("Failed to parse chat history:", error);
          // Reset if there's an error
          setMessages([]);
        }
      }
    }
  }, []);

  // Save messages to localStorage whenever they change
  useEffect(() => {
    if (messages.length > 0 && typeof window !== 'undefined') {
      localStorage.setItem('chatHistory', JSON.stringify(messages));
    }
  }, [messages]);

  useEffect(() => {
    // Scroll to the bottom when messages change
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  // Add initial bot greeting when chat is opened
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      const randomGreeting = botResponses.greeting[Math.floor(Math.random() * botResponses.greeting.length)];
      setMessages([
        {
          id: 1,
          text: randomGreeting,
          isUser: false,
          timestamp: new Date()
        }
      ]);
    }
  }, [isOpen, messages.length]);

  const handleSend = () => {
    if (input.trim() === '') return;

    // Add user message
    const newMessages = [
      ...messages,
      {
        id: messages.length + 1,
        text: input,
        isUser: true,
        timestamp: new Date()
      }
    ];
    
    setMessages(newMessages);
    setInput('');
    setShowSuggestions(false);
    setIsTyping(true);
    
    // Process the user input and generate a response
    setTimeout(() => {
      const botResponse = generateBotResponse(input.toLowerCase());
      setIsTyping(false);
      setMessages((prevMessages) => [
        ...prevMessages,
        {
          id: prevMessages.length + 1,
          text: botResponse,
          isUser: false,
          timestamp: new Date()
        }
      ]);
    }, 1500);
  };

  const handleSuggestionClick = (suggestion: string) => {
    setInput(suggestion);
    // Add user message
    const newMessages = [
      ...messages,
      {
        id: messages.length + 1,
        text: suggestion,
        isUser: true,
        timestamp: new Date()
      }
    ];
    
    setMessages(newMessages);
    setInput('');
    setShowSuggestions(false);
    setIsTyping(true);
    
    // Process the suggestion and generate a response
    setTimeout(() => {
      const botResponse = generateBotResponse(suggestion.toLowerCase());
      setIsTyping(false);
      setMessages((prevMessages) => [
        ...prevMessages,
        {
          id: prevMessages.length + 1,
          text: botResponse,
          isUser: false,
          timestamp: new Date()
        }
      ]);
    }, 1500);
  };

  const generateBotResponse = (userInput: string): string => {
    const input = userInput.toLowerCase();
    
    if (input.includes('book') || input.includes('booking') || input.includes('reserve')) {
      if (input.includes('urgent') || input.includes('premium') || input.includes('emergency')) {
        return botResponses.urgentBooking[Math.floor(Math.random() * botResponses.urgentBooking.length)];
      }
      return botResponses.booking[Math.floor(Math.random() * botResponses.booking.length)];
    } else if (input.includes('service') || input.includes('puja') || input.includes('ceremony')) {
      return botResponses.services[Math.floor(Math.random() * botResponses.services.length)];
    } else if (input.includes('location') || input.includes('city') || input.includes('where')) {
      return botResponses.locations[Math.floor(Math.random() * botResponses.locations.length)];
    } else if (input.includes('samagri') || input.includes('material') || input.includes('items')) {
      return botResponses.samagri[Math.floor(Math.random() * botResponses.samagri.length)];
    } else if (input.includes('darshan') || input.includes('temple') || input.includes('live')) {
      return botResponses.darshan[Math.floor(Math.random() * botResponses.darshan.length)];
    } else if (input.includes('panchang') || input.includes('muhurat') || input.includes('today') || input.includes('auspicious')) {
      return botResponses.panchang[Math.floor(Math.random() * botResponses.panchang.length)];
    } else if (input.includes('festival') || input.includes('upcoming') || input.includes('celebration') || input.includes('diwali') || input.includes('navratri')) {
      return botResponses.festivals[Math.floor(Math.random() * botResponses.festivals.length)];
    } else {
      // Try to extract intent using more advanced pattern matching
      const bookingPatterns = ['need', 'want', 'looking', 'search'];
      const servicePatterns = ['perform', 'conduct', 'do', 'arrange'];
      
      for (const pattern of bookingPatterns) {
        if (input.includes(pattern)) {
          return botResponses.booking[Math.floor(Math.random() * botResponses.booking.length)];
        }
      }
      
      for (const pattern of servicePatterns) {
        if (input.includes(pattern)) {
          return botResponses.services[Math.floor(Math.random() * botResponses.services.length)];
        }
      }
      
      return botResponses.fallback[Math.floor(Math.random() * botResponses.fallback.length)];
    }
  };

  const clearChat = () => {
    setMessages([]);
    localStorage.removeItem('chatHistory');
    // Re-initialize with greeting
    const randomGreeting = botResponses.greeting[Math.floor(Math.random() * botResponses.greeting.length)];
    setMessages([
      {
        id: 1,
        text: randomGreeting,
        isUser: false,
        timestamp: new Date()
      }
    ]);
    setShowSuggestions(true);
  };

  return (
    <>
      {/* Chat button - fixed at bottom right */}
      <button 
        className={`fixed bottom-6 right-6 z-50 p-4 bg-orange-600 text-white rounded-full shadow-lg hover:bg-orange-700 transition-all ${isOpen ? 'scale-0' : 'scale-100'}`}
        onClick={() => setIsOpen(true)}
        aria-label="Open chat assistant"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
        </svg>
      </button>

      {/* Chat window */}
      <div className={`fixed bottom-6 right-6 z-50 w-80 md:w-96 bg-white rounded-lg shadow-xl transition-all duration-300 ${isOpen ? 'scale-100 opacity-100' : 'scale-0 opacity-0'}`}>
        {/* Chat header */}
        <div className="bg-orange-600 text-white px-4 py-3 rounded-t-lg flex justify-between items-center">
          <div className="flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
            </svg>
            <h3 className="font-medium">Pandit Assistant</h3>
          </div>
          <div className="flex items-center">
            <button 
              onClick={clearChat}
              className="mr-3 text-white hover:text-orange-200 transition-colors" 
              aria-label="Clear chat history"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </button>
            <button 
              onClick={() => setIsOpen(false)} 
              aria-label="Close chat"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        </div>

        {/* Chat messages */}
        <div className="h-96 overflow-y-auto p-4 bg-gray-50">
          {messages.map((msg) => (
            <div 
              key={msg.id} 
              className={`mb-3 ${msg.isUser ? 'text-right' : 'text-left'}`}
            >
              <div 
                className={`inline-block p-3 rounded-lg max-w-xs md:max-w-sm ${
                  msg.isUser ? 'bg-orange-600 text-white' : 'bg-white text-gray-800 border border-gray-200'
                }`}
              >
                {msg.text}
              </div>
              <div className={`text-xs text-gray-500 mt-1 ${msg.isUser ? 'text-right' : 'text-left'}`}>
                {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </div>
            </div>
          ))}
          
          {/* Typing indicator */}
          {isTyping && (
            <div className="flex items-center space-x-1 mb-3">
              <div className="bg-gray-200 p-2 rounded-full animate-pulse"></div>
              <div className="bg-gray-200 p-2 rounded-full animate-pulse delay-100"></div>
              <div className="bg-gray-200 p-2 rounded-full animate-pulse delay-200"></div>
            </div>
          )}
          
          {showSuggestions && messages.length < 3 && (
            <div className="mt-4">
              <p className="text-xs text-gray-500 mb-2">Suggested questions:</p>
              <div className="flex flex-wrap gap-2">
                {quickSuggestions.map((suggestion, index) => (
                  <button
                    key={index}
                    onClick={() => handleSuggestionClick(suggestion)}
                    className="bg-gray-100 text-gray-800 text-sm rounded-full px-3 py-1 hover:bg-gray-200"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Chat input */}
        <div className="p-3 border-t">
          <div className="flex items-center">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Type your question..."
              className="flex-1 rounded-l-lg border border-gray-300 py-2 px-3 focus:outline-none focus:ring-1 focus:ring-orange-500 focus:border-orange-500"
              aria-label="Chat message"
            />
            <button
              onClick={handleSend}
              className="bg-orange-600 text-white rounded-r-lg px-4 py-2 hover:bg-orange-700"
              aria-label="Send message"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </>
  );
}