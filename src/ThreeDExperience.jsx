import './style.css';
import { Canvas } from '@react-three/fiber';
import Experience from './Experience.jsx';
import { KeyboardControls } from '@react-three/drei';
import { useEffect } from 'react';

const ThreeDExperience = () => {
  
  // Use effect to reset scroll and disable overflow when switching to 3D experience
  useEffect(() => {
    window.scrollTo(0, 0); // Scroll to the top when switching to 3D experience
    document.body.style.overflow = 'hidden'; // Hide overflow to avoid scrollbars
    return () => {
      document.body.style.overflow = ''; // Reset overflow when 3D experience is unmounted
    };
  }, []);

  return (
    <div className="canvas-container">
      <KeyboardControls
        map={[
          { name: 'forward', keys: ['ArrowUp', 'KeyW'] },
          { name: 'backward', keys: ['ArrowDown', 'KeyS'] },
          { name: 'leftward', keys: ['ArrowLeft', 'KeyA'] },
          { name: 'rightward', keys: ['ArrowRight', 'KeyD'] },
          { name: 'jump', keys: ['Space'] },
        ]}
      >
        <Canvas
          shadows
          camera={{
            fov: 45,
            near: 0.1,
            far: 200,
            position: [2.5, 4, 6],
          }}
        >
          <Experience />
        </Canvas>
      </KeyboardControls>
    </div>
  );
};

export default ThreeDExperience;
