import React from 'react';

export default function Footer() {
  return (
    <footer className="w-full py-6 text-center text-sm text-gray-400 mt-auto">
      Made with{' '}
      <a
        href="https://firecrawl.dev"
        target="_blank"
        rel="noopener noreferrer"
        className="text-gray-500 hover:text-gray-700 font-medium transition-colors"
      >
        Firecrawl
      </a>
      {' '}by{' '}
      <a
        href="https://flowful.ai"
        target="_blank"
        rel="noopener noreferrer"
        className="text-orange-500 hover:text-orange-600 font-medium transition-colors"
      >
        Flowful.ai
      </a>
    </footer>
  );
} 