import React, { useState, useEffect } from 'react';
import './App.css'; // Main styling for the app
import ThreeDExperience from './ThreeDExperience'; // 3D experience component
import Typewriter from './Typewriter'; // Import the Typewriter component
import ProjectsCarousel from './ProjectsCarousel';
import AnimatedText from './AnimatedText';
import SkillsSection from './SkillsSection';



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
        <>
          <div className="banner" onClick={launch3D}>
            Try 3D Experience (work in progress)
          </div>

          <div className="container">
            <div className="left-section">
              <div className="profile-container">
                <img src="images/pfp-face.jpg" alt="Profile Picture" className="profile-picture" />
                <div className="name-title">
                  <Typewriter text="Subhash Prasad" speed={80} />
                  <AnimatedText
                    phrases={["Software Engineer", "Problem Solver", "Maker", "EECS Major", "Dinosaur Lover"]}
                    interval={4000}
                    speed={50}
                  />
                  <div className="social-links">
                    <a href="https://github.com/subhashjprasad" target="_blank" rel="noopener noreferrer">
                      <img src="images/github.png" alt="GitHub" className="social-icon" />
                    </a>
                    <a href="https://linkedin.com/in/subhash-j-prasad" target="_blank" rel="noopener noreferrer">
                      <img src="images/linkedin.png" alt="LinkedIn" className="social-icon" />
                    </a>
                  </div>
                </div>
              </div>

              {/* Education Section */}
              <div className="education-section">
                <h3>University of California, Berkeley</h3>
                <p>B.S. in Electrical Engineering and Computer Sciences (<span style={{color: '#6FC1FF'}}>EECS</span>)</p>
                <p>GPA: <span style={{color: '#6FC1FF'}}>4.00</span> / 4.00</p>
                <p>Expected Graduation <span style={{color: '#6FC1FF'}}>2026</span></p>

                {/* Organizations Section */}
                <div
                  className="dropdown-header"
                  onClick={() => setShowOrganizations(!showOrganizations)}
                >
                  <span className="education-header">Organizations</span> {showOrganizations ? "▲" : "▼"}
                </div>
                <div className={`dropdown-content ${showOrganizations ? 'open' : ''}`}>
                  <p>HKN Mu Chapter (EECS Honor Society) - Industrial Relations Officer</p>
                  <p>IEEE - Member</p>
                  <p>CSUA - Member</p>
                </div>

                {/* Relevant Coursework Section */}
                <div
                  className="dropdown-header"
                  onClick={() => setShowCoursework(!showCoursework)}
                >
                  <span className="education-header">Relevant Coursework</span> {showCoursework ? "▲" : "▼"}
                </div>
                <div className={`dropdown-content-long ${showCoursework ? 'open' : ''}`}>
                  <p>Efficient Algorithms & Intractable Problems</p>
                  <p>Neural Computation</p>
                  <p>Discrete Mathematics & Probability Theory</p>
                  <p>Data Structures & Algorithms</p>
                  <p>Great Ideas in Computer Architecture</p>
                  <p>Designing Information Devices & Systems</p>
                  <p>Esoteric Programming Languages</p>
                </div>
              </div>

              {/* Skills Section */}
                <h1 className="skills-title">Skills</h1>
                <SkillsSection />
            </div>

            {/* Right Section */}
            <div className="right-section">
            <h1 className="section-title">Experiences</h1>
              <div className="experience">

                <div className="experience-item">
                  <div class="date-range">
                    08/2024 — PRESENT
                    <img src="images/redwood.jpg" alt="" class="experience-image"></img>
                  </div>
                  <div className="role-company">
                    <h3>Researcher <span style={{color: '#D6EDFF'}}>·</span> <a href="https://redwood.berkeley.edu/">Redwood Center for Theoretical <br></br> Neuroscience</a></h3>
                    <p>
                    Optimizing process of solving hard combinatorial problems (k-SAT) through coupled-oscillator implementation of Ising models. Researching application in solving Multiple-Input-Multiple-Output (MIMO) problems.
                    </p>
                    <div className="skills">
                      <span className="skill-badge">Google JAX</span>
                      <span className="skill-badge">Machine Learning</span>
                      <span className="skill-badge">Optimization</span>
                      <span className="skill-badge">Python</span>
                    </div>
                  </div>
                </div>

                <div className="experience-item">
                  <div class="date-range">
                    02/2024 — PRESENT
                    <img src="images/berkeleytime.png" alt="" class="experience-image"></img>
                  </div>
                  <div className="role-company">
                    <h3>Backend Developer <span style={{color: '#D6EDFF'}}>·</span> <a href="https://berkeleytime.com/">Berkeleytime</a></h3>
                    <p>
                    Managing and implementing novel features for UC Berkeley's most popular online course discovery platform used by 30k+ users monthly. Designed scalable backend, building semantic search pipeline to increase accesibility.
                    </p>
                    <div className="skills">
                      <span className="skill-badge">TypeScript</span>
                      <span className="skill-badge">GraphQL</span>
                      <span className="skill-badge">MongoDB</span>
                      <span className="skill-badge">Kubernetes</span>
                      <span className="skill-badge">Docker</span>
                      <span className="skill-badge">PyTorch</span>
                      <span className="skill-badge">Python</span>
                      <span className="skill-badge">Poetry</span>
                      <span className="skill-badge">Git</span>
                    </div>
                  </div>
                </div>

                <div className="experience-item">
                  <div class="date-range">
                    06/2024 - 08/2024
                    <img src="images/verizon.png" alt="" class="experience-image"></img>
                  </div>
                  <div className="role-company">
                    <h3>Network Systems Engineering Intern <span style={{color: '#D6EDFF'}}>·</span> <a href="https://www.verizon.com/">Verizon</a></h3>
                    <p>
                    Developed tool to visualize nationwide network topology, monitor millions of customer KPIs + data-quality, and improve risk-mitigation. Achieved an estimated 20% reduction in MTTR (Mean Time to Repair).
                    </p>
                    <div className="skills">
                      <span className="skill-badge">Java</span>
                      <span className="skill-badge">Spring Boot</span>
                      <span className="skill-badge">Swagger API</span>
                      <span className="skill-badge">GraphQL</span>
                      <span className="skill-badge">Neo4j</span>
                      <span className="skill-badge">MongoDB</span>
                      <span className="skill-badge">PostgresQL</span>
                      <span className="skill-badge">DBeaver</span>
                      <span className="skill-badge">React.JS</span>
                      <span className="skill-badge">Next.JS</span>
                      <span className="skill-badge">Git</span>
                    </div>
                  </div>
                </div>

                <div className="experience-item">
                  <div class="date-range">
                    03/2024 - 06/2024
                    <img src="images/eesa.jpg" alt="" class="experience-image"></img>
                  </div>
                  <div className="role-company">
                    <h3>Full-Stack Developer Intern <span style={{color: '#D6EDFF'}}>·</span> <a href="https://www.linkedin.com/company/eesa-ai/">Eesa</a></h3>
                    <p>
                    Devised and implemented majority of the Eesa Chatbot website frontend, integrated with backend, and built in-house online authentication pipeline to regulate and store customer information.
                    </p>
                    <div className="skills">
                      <span className="skill-badge">React.JS</span>
                      <span className="skill-badge">JavaScript</span>
                      <span className="skill-badge">HTML</span>
                      <span className="skill-badge">CSS</span>
                      <span className="skill-badge">Auth0</span>
                      <span className="skill-badge">Git</span>
                    </div>
                  </div>
                </div>

                <div className="experience-item">
                  <div class="date-range">
                    12/2023 - 05/2024
                    <img src="images/carviz.jpg" alt="" class="experience-image"></img>
                  </div>
                  <div className="role-company">
                    <h3>AI/ML Engineering Intern <span style={{color: '#D6EDFF'}}>·</span> <a href="https://carviz.com/">Carviz</a></h3>
                    <p>
                    Created and optimized 20+ machine learning models to detect/classify car parts and damage, constructed pipeline for integration into comprehensive vehicle inspection platform.
                    </p>
                    <div className="skills">
                      <span className="skill-badge">TensorFlow</span>
                      <span className="skill-badge">PyTorch</span>
                      <span className="skill-badge">AWS SageMaker</span>
                      <span className="skill-badge">AWS Lambda</span>
                      <span className="skill-badge">Amazon S3</span>
                      <span className="skill-badge">Python</span>
                      <span className="skill-badge">Machine Learning</span>
                      <span className="skill-badge">Git</span>
                    </div>
                  </div>
                </div>

              </div>

            </div>
          </div>

          {/* Projects Carousel Section */}
          <h1 className="section-title centered">Projects</h1>
              <ProjectsCarousel />
        </>
      )}
    </div>
  );
};

export default App;
