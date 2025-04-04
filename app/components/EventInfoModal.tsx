import { useEffect, useState } from 'react';
import { FiX, FiLoader } from 'react-icons/fi';

interface EventInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
  eventId: string;
  eventTitle: string;
  onRegisterUrlFound?: (url: string) => void;
}

const EventInfoModal = ({ isOpen, onClose, eventId, eventTitle, onRegisterUrlFound }: EventInfoModalProps) => {
  const [content, setContent] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen && eventId) {
      setIsLoading(true);
      setError(null);
      
      // Hardcoded content for each event
      if (eventId === '1') {
        const eventContent = `Masters of Tech Unite! 🎤🔥👇

Join us for an exclusive expert talk featuring Love Babbar, the Founder of CodeHelp, Former SDE at Microsoft & Amazon and Lakshay Kumar, Computer Scientist at Adobe, Co-Founder of CodeHelp. 🌟

🚀 Learn from the best in the industry as they share insights on innovation, problem-solving, and their journeys in the tech world. With their vast experience and knowledge, this is a golden opportunity to level up your skills and network with the brightest minds in tech.

Event Details:
📅 Date: 11th February 2025
🕒 Time: 10:00 AM
📍 Venue: Main Auditorium, CGC

📌 Forms Outing Date: 23rd January 2025

💡 When vision meets excellence, tech knowledge reaches new heights. Don't miss this game-changing event brought to you by Fusion Club!`;
        
        setContent(eventContent);
        
        // Only extract registration URL if it exists in the original content
        const registerUrlMatch = eventContent.match(/🔗 REGISTER NOW[^]*?https:\/\/forms\.gle\/[^\s]+/);
        if (registerUrlMatch) {
          const urlMatch = registerUrlMatch[0].match(/(https:\/\/forms\.gle\/[^\s]+)/);
          if (urlMatch && onRegisterUrlFound) {
            onRegisterUrlFound(urlMatch[0]);
          }
        }
        
        setIsLoading(false);
      } else if (eventId === '2') {
        const eventContent = `🚀 Fusion X – The Ultimate Tech Battle: Revamped and Ready! 🚀

Hey Fusion crew! 🌟 We heard you, and we've supercharged Fusion X to be leaner, meaner, and more thrilling than ever! Get ready for an intense battle of speed, creativity, and innovation.
---

🔥 What's New?

We've streamlined the event to two epic rounds that will push your skills to the limit! Say goodbye to Logic Leviathan and hello to a faster, action-packed showdown!
---

🎯 Updated Event Rundown

Round 1: Buzzer Blast 💡
A high-energy, riddle-packed buzzer challenge! Quick thinking and technical prowess will decide the winners. ⚡

Round 2: Prompt-X: AI Showdown 🤖
A creative clash using cutting-edge AI tools like chatgpt etc ! Build a standout website from a surprise prototype and claim your glory. 🚀
---

📅 Event Details

📍 Date: April 4, 2025
⏰ Time: 9:30 AM
📌 Venue: Wilson Block (Block 3)
💰 Entry Fee: ₹60 per team(1 or 2 member)

---

!🏆 What's at Stake?

🥇 Exciting Cash Prizes for the Champs!
📜 E-Certificates for All Participants!
🎓 Attendance Credit Included!
🔥 And a Special Opportunity…

🚀 EXCLUSIVE WINNER PERK: If the winner is a 1st or 2nd-year student of CSE CEC, they'll get a chance to join the Fusion Club next semester!
---

📚 🧾  Rule Book:-
https://drive.google.com/file/d/143OjQdAnkyRZ6wvTcEfcgAEsefgIgY5y/view?usp=drivesdk

🔗 REGISTER NOW & CLAIM YOUR SPOT:
https://forms.gle/7fNRxaUYaP1Vnt128

📞 For More Info, Contact:
📱 Naman Gupta : 9024584691
📱 Azhar : 7018470899

🌟 Follow us & Stay Updated!
📢 Instagram : @fusionclub_cec

🔥 The stage is set. The challenge awaits. Will you rise to the occasion? See you at FUSION X!`;
        
        setContent(eventContent);
        
        // Extract registration URL
        const registerUrlMatch = eventContent.match(/🔗 REGISTER NOW[^]*?https:\/\/forms\.gle\/[^\s]+/);
        if (registerUrlMatch) {
          const urlMatch = registerUrlMatch[0].match(/(https:\/\/forms\.gle\/[^\s]+)/);
          if (urlMatch && onRegisterUrlFound) {
            onRegisterUrlFound(urlMatch[0]);
          }
        }
        
        setIsLoading(false);
      } else {
        setError('Event information not found');
        setIsLoading(false);
      }
    }
  }, [isOpen, eventId, onRegisterUrlFound]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
      <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        {/* Background overlay */}
        <div 
          className="fixed inset-0 bg-dark bg-opacity-80 transition-opacity backdrop-blur-sm" 
          aria-hidden="true"
          onClick={onClose}
        ></div>

        {/* Modal panel */}
        <div className="inline-block align-bottom glass-modal rounded-lg text-left overflow-hidden shadow-custom-lg transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full">
          <div className="px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="flex items-start justify-between">
              <h3 className="text-2xl leading-6 font-bold text-white" id="modal-title">
                {eventTitle}
              </h3>
              <button 
                onClick={onClose}
                className="bg-white/5 backdrop-blur-sm rounded-md text-gray-400 hover:text-white focus:outline-none p-2 border border-white/10"
              >
                <span className="sr-only">Close</span>
                <FiX className="h-6 w-6" />
              </button>
            </div>
            
            <div className="mt-4 border-t border-white/10 pt-4">
              {isLoading ? (
                <div className="py-12 flex justify-center">
                  <FiLoader className="h-10 w-10 text-primary animate-spin" />
                </div>
              ) : error ? (
                <div className="py-6 text-center text-red-500">
                  {error}
                </div>
              ) : (
                <div className="prose-invert max-w-none overflow-auto max-h-[70vh] pr-2 whitespace-pre-wrap text-gray-300">
                  {content.split('\n').map((line, index) => {
                    // Check if line contains a URL
                    const urlRegex = /(https?:\/\/[^\s]+)/g;
                    const containsUrl = urlRegex.test(line);
                    
                    if (containsUrl) {
                      // Split the line into text and URLs
                      const parts = line.split(urlRegex);
                      const matches = line.match(urlRegex) || [];
                      
                      return (
                        <p key={index} className="my-2">
                          {parts.map((part, i) => {
                            // If this part is a URL (every even index after the first)
                            if (i > 0 && i % 2 === 1) {
                              const urlIndex = Math.floor(i / 2);
                              return (
                                <a 
                                  key={i} 
                                  href={matches[urlIndex]} 
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                  className="text-primary hover:text-primary/80 underline"
                                >
                                  {matches[urlIndex]}
                                </a>
                              );
                            }
                            return part;
                          })}
                        </p>
                      );
                    }
                    
                    // Handle special formatting for headings and sections
                    if (line.startsWith('# ') || line.startsWith('## ')) {
                      return <h2 key={index} className="text-2xl font-bold text-white mt-4 mb-2">{line.replace(/^#+ /, '')}</h2>;
                    } else if (line.trim() === '---') {
                      return <hr key={index} className="my-4 border-gray-700" />;
                    } else if (line.startsWith('📅') || line.startsWith('🔥') || line.startsWith('🎯') || line.startsWith('!🏆') || line.startsWith('📚')) {
                      return <h3 key={index} className="text-xl font-semibold text-primary mt-3 mb-2">{line}</h3>;
                    } else {
                      return <p key={index} className="my-1">{line}</p>;
                    }
                  })}
                </div>
              )}
            </div>
          </div>
          
          <div className="bg-black/30 backdrop-blur-md px-4 py-3 sm:px-6 flex flex-row-reverse border-t border-white/5">
            <button
              type="button"
              className="glass-button-primary rounded-md py-2 px-4"
              onClick={onClose}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventInfoModal; 