import React, { useEffect, useState } from 'react';
import './AnimatedText.css';

const AnimatedText = ({ phrases, interval = 3000, speed = 100 }) => {
  const [displayText, setDisplayText] = useState(phrases[0].split(''));
  const [currentPhraseIndex, setCurrentPhraseIndex] = useState(0);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentPhraseIndex((prevIndex) => (prevIndex + 1) % phrases.length);
    }, interval);

    return () => clearInterval(intervalId);
  }, [interval, phrases.length]);

  useEffect(() => {
    animateTransition();
  }, [currentPhraseIndex]);

  const animateTransition = () => {
    const targetText = phrases[currentPhraseIndex].split('');
    const maxLength = Math.max(displayText.length, targetText.length);
    let newDisplayText = [...displayText];

    // Adjust displayText to match targetText length by adding/removing spaces
    while (newDisplayText.length < maxLength) newDisplayText.push(' ');
    while (newDisplayText.length > maxLength) newDisplayText.pop();

    // Generate a list of indices in random order
    const indices = Array.from({ length: maxLength }, (_, i) => i);
    shuffleArray(indices);

    // Animate each character change in random order
    indices.forEach((i, index) => {
      setTimeout(() => {
        newDisplayText[i] = targetText[i] || ' ';
        setDisplayText([...newDisplayText]);
      }, index * speed + Math.random() * speed);
    });

    // Cleanup: Ensure extra characters are removed after animation
    setTimeout(() => {
      setDisplayText(targetText); // Set to exact targetText length
    }, maxLength * speed);
  };

  // Helper function to shuffle an array
  const shuffleArray = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
  };

  return (
    <h2 className="animated-text">
      {displayText.map((char, index) => (
        <span key={index} className="char">
          {char === ' ' ? '\u00A0' : char} {/* Use non-breaking space for visible spaces */}
        </span>
      ))}
    </h2>
  );
};

export default AnimatedText;
