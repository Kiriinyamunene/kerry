import React from 'react';
import { motion } from 'framer-motion';

const projects = [
  {
    id: 1,
    title: "AI Image Generator",
    description: "A deep learning model that generates images from text descriptions using DALL-E architecture.",
    tags: ["React", "TensorFlow", "Python", "AI"],
    image: "/projects/project1.jpg"
  },
  {
    id: 2,
    title: "E-commerce Mobile App",
    description: "Feature-rich mobile application for online shopping with AR product visualization.",
    tags: ["React Native", "Firebase", "AR", "Node.js"],
    image: "/projects/project2.jpg"
  },
  {
    id: 3,
    title: "Data Visualization Dashboard",
    description: "Interactive dashboard for visualizing complex datasets with customizable charts and filters.",
    tags: ["D3.js", "Vue", "Python", "Data Science"],
    image: "/projects/project3.jpg"
  }
];

const ProjectsSection = () => {
  return (
    <section id="projects" className="py-20 bg-gradient-to-b from-black to-gray-900">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 1 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl font-bold mb-4 text-center">
            <span className="bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">
              My Projects
            </span>
          </h2>
          <p className="text-xl text-center text-gray-300 mb-12 max-w-2xl mx-auto">
            Showcasing a selection of my work across web, mobile, and AI domains.
          </p>
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      </div>
    </section>
  );
};

const ProjectCard = ({ project }: { project: any }) => {
  return (
    <motion.div
      initial={{ y: 50, opacity: 0 }}
      whileInView={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true }}
      className="bg-gray-800/50 backdrop-blur-sm rounded-xl overflow-hidden hover:shadow-xl hover:shadow-cyan-500/10 transition-all duration-300"
    >
      <div className="h-56 relative">
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent z-10" />
        <div className="w-full h-full relative">
          {/* You'll need to add actual project images */}
          <div className="w-full h-full bg-gradient-to-r from-blue-900 to-cyan-900"></div>
        </div>
      </div>
      
      <div className="p-6">
        <h3 className="text-2xl font-bold text-white mb-2">{project.title}</h3>
        <p className="text-gray-300 mb-4">{project.description}</p>
        
        <div className="flex flex-wrap gap-2 mb-6">
          {project.tags.map((tag: string) => (
            <span key={tag} className="px-3 py-1 bg-gray-700 rounded-full text-sm text-cyan-300">
              {tag}
            </span>
          ))}
        </div>
        
        <button className="px-4 py-2 bg-cyan-600/20 border border-cyan-500 text-cyan-400 rounded-lg hover:bg-cyan-600/30 transition-colors">
          View Project
        </button>
      </div>
    </motion.div>
  );
};

export default ProjectsSection;
