import React from 'react';
import Link from 'next/link';

const Footer = () => {
  return (
    <footer className="py-12 bg-black/30 backdrop-blur-sm border-t border-gray-800">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">Kerry</h3>
            <p className="text-gray-300">
              Web Developer | Mobile App Developer | Data Science & AI Specialist
            </p>
            <div className="flex mt-4 space-x-4">
              <SocialIcon icon="github" />
              <SocialIcon icon="linkedin" />
              <SocialIcon icon="twitter" />
            </div>
          </div>
          
          <div>
            <h3 className="text-xl font-bold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              {['Home', 'Projects', 'Skills', 'About', 'Contact'].map((item) => (
                <li key={item}>
                  <Link href={`/#${item.toLowerCase()}`} className="text-gray-300 hover:text-cyan-400 transition-colors">
                    {item}
                  </Link>
                </li>
              ))}
              <li>
                <Link href="/game" className="text-gray-300 hover:text-cyan-400 transition-colors">
                  <span className="flex items-center">
                    Cyber Runner
                    <span className="ml-2 px-2 py-0.5 text-xs bg-cyan-600 rounded-md">Game</span>
                  </span>
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-xl font-bold mb-4">Contact</h3>
            <p className="text-gray-300 mb-2">Email: kerry@example.com</p>
            <p className="text-gray-300">Location: City, Country</p>
          </div>
        </div>
        
        <div className="mt-12 pt-6 border-t border-gray-800 text-center text-gray-400">
          <p>&copy; {new Date().getFullYear()} Kerry. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

// Social media icon component
const SocialIcon = ({ icon }: { icon: string }) => {
  return (
    <a href="#" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-cyan-600 transition-colors">
      <span className="sr-only">{icon}</span>
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
      </svg>
    </a>
  );
};

export default Footer;
