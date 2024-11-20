import React, { useState, useEffect } from 'react';

export default function Typewriter({ text, speed = 80 }) {
  const [displayedText, setDisplayedText] = useState('');
  const [index, setIndex] = useState(0);
  const [showCursor, setShowCursor] = useState(true);

  // Typewriter effect for the name
  useEffect(() => {
    if (index < text.length) {
      const timeoutId = setTimeout(() => {
        setDisplayedText((prev) => prev + text.charAt(index)); // Add one character at a time
        setIndex(index + 1);
      }, speed);

      return () => clearTimeout(timeoutId); // Cleanup on unmount
    }
  }, [index, text, speed]);

  // Flashing cursor effect
  useEffect(() => {
    const cursorInterval = setInterval(() => {
      setShowCursor((prev) => !prev); // Toggle the cursor visibility
    }, 500); // Cursor flashes every 500ms

    return () => clearInterval(cursorInterval); // Cleanup on unmount
  }, []);

  return (
    <h1>
      {displayedText}
      <span className="cursor">{showCursor ? '_' : ' '}</span> {/* Add flashing cursor */}
    </h1>
  );
}