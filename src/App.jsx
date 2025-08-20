import React, { useState, useEffect } from 'react';
import './App.css'; // Main styling for the app
import ThreeDExperience from './ThreeDExperience'; // 3D experience component
import FuzzyText from './components/FuzzyText';
import Typewriter from './Typewriter'; // Import the Typewriter component
import ProjectsCarousel from './ProjectsCarousel';
import AnimatedText from './AnimatedText';
import SkillsSection from './SkillsSection';
import MinimalLanding from './components/MinimalLanding';



const App = () => {
  const [is3D, setIs3D] = useState(false); // Track whether to show 3D experience
  const [showOrganizations, setShowOrganizations] = useState(false);
  const [showCoursework, setShowCoursework] = useState(false);

  // Function to handle switching to 3D experience
  const launch3D = () => {
    setIs3D(true); // Switch to the 3D experience view
  };

  return (
    <div className="root">
      {is3D ? (
        <ThreeDExperience />
      ) : (
        <FuzzyText />
      )}
    </div>
  );
};

export default App;
