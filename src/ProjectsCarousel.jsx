import React from 'react';
import './ProjectsCarousel.css'; // CSS for the carousel

const projects = [
  {
    title: 'Berkeley Room Finder',
    description: "An easy-to-use web app that helps students find study spots on campus.",
    image: 'images/brf.png',
  },
  {
    title: 'Bop',
    description: 'A custom programming language in the style of a rhythm game.',
    image: 'images/bop.png',
  },
  {
    title: 'Graversal',
    description: 'A rage-inducing, gravity-switching, eye-popping mobile platformer game.',
    image: 'images/grav.png',
  },
  {
    title: 'Lecturix',
    description: 'An LLM pipeline to convert lecture notes into full-fledged lectures with animations.',
    image: 'images/lecturix.png',
  },
  {
    title: '3D Portfolio Website',
    description: 'A colorful, wacky, physics-based representation of my personal portfolio (in progress).',
    image: 'images/website.png',
  },
];

const ProjectsCarousel = () => {
  return (
    <div className="carousel-container">
      <div className="carousel-slide-wrapper">
        <div className="carousel-slide">
          {/* Duplicate the projects array to simulate infinite loop */}
          {projects.concat(projects).map((project, index) => (
            <div className="carousel-item" key={index}>
              <img
                src={project.image}
                alt={project.title}
                className="carousel-image"
              />
              <div className="carousel-content">
                <h3>{project.title}</h3>
                <p>{project.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProjectsCarousel;
