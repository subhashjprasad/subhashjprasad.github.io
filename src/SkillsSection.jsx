import React from "react";
import "./SkillsSection.css";

const skills = [
  { id: "python", name: "Python", icon: "images/python.png", scale: 1 },
  { id: "java", name: "Java", icon: "images/java.png", scale: 1 },
  { id: "c", name: "C", icon: "images/c.png", scale: 0.8 },
  { id: "jax", name: "Google JAX", icon: "images/jax.png", scale: 0.8 },
  { id: "pytorch", name: "PyTorch", icon: "images/pytorch.png", scale: 0.8 },
  { id: "tensorflow", name: "TensorFlow", icon: "images/tensorflow.png", scale: 1 },
  { id: "docker", name: "Docker", icon: "images/docker.png", scale: 0.9 },
  { id: "kubernetes", name: "Kubernetes", icon: "images/kubernetes.png", scale: 1 },
  { id: "postgresql", name: "PostgreSQL", icon: "images/postgresql.png", scale: 1 },
  { id: "mongodb", name: "MongoDB", icon: "images/mongodb.png", scale: 1 },
  { id: "graphql", name: "GraphQL", icon: "images/graphql.png", scale: 0.8 },
  { id: "neo4j", name: "Neo4j", icon: "images/neo4j.png", scale: 1.1 },
  { id: "springboot", name: "Spring Boot", icon: "images/springboot.png", scale: 0.8 },
  { id: "swagger", name: "Swagger", icon: "images/swagger.png", scale: 0.8 },
  { id: "aws", name: "AWS", icon: "images/aws.png", scale: 0.9 },
  { id: "react", name: "React", icon: "images/react.png", scale: 1 },
  { id: "threejs", name: "Three.JS", icon: "images/threejs.png", scale: 1 },
  { id: "javascript", name: "JavaScript", icon: "images/javascript.png", scale: 0.8 },
  { id: "git", name: "Git", icon: "images/git.png", scale: 0.8 },
];

const SkillsSection = () => { 
  return (
    <div className="skills-section">
      {skills.map((skill) => (
        <div className="skill-circle" key={skill.id}>
          <img 
            src={skill.icon} 
            alt={skill.name} 
            className="skill-icon" 
            style={{
              transform: `scale(${skill.scale})`,
            }} 
          />
          <span className="skill-name">{skill.name}</span>
        </div>
      ))}
    </div>
  );
};

export default SkillsSection;
