import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLinkedin, faGithub } from '@fortawesome/free-brands-svg-icons';
import profile1 from './creator1.jpg';
import profile2 from './creator2.jpg';
import { Header } from '../components';

const Creators = () => {
  return (
    <div className="m-2 md:m-10 mt-24 p-2 md:p-10 bg-white rounded-3xl">
      {/* Center the header */}
      <div className="flex justify-center">
        <Header category="Creators" title="Meet the Developers" />
      </div>
      {/* Main content with profiles */}
      <div className="max-w-5xl mx-auto my-8 p-6 bg-white rounded-lg shadow-lg">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          {/* Profile 1 */}
          <div className="flex flex-col items-center text-center">
            <img
              src={profile1}
              alt="Creator 1"
              className="w-72 h-72 rounded-full object-cover mb-4 border-2 border-gray-300"
            />
            {/* Name in bold */}
            <h3 className="text-xl font-bold">Haad Ahmed Cheema</h3>
            {/* About Me */}
            <p className="text-gray-600 mt-2">I'm a computer science student at Iowa State University. I'm also the vice-president of the web development club. I work at the Computer Science Help Room. I started coding when I came to Iowa State University, and I've developed a love for software development.</p>
            {/* Contact Information */}
            <p className="text-gray-500 mt-4">
              <strong>Email:</strong> haad736@iastate.edu
            </p>
            {/* LinkedIn and GitHub with icons */}
            <div className="flex gap-4 mt-4">
              <a
                href="https://www.linkedin.com/in/haad-cheema-931105241/" // Replace with correct LinkedIn URL
                className="text-blue-600"
                target="_blank" // Open link in a new tab
                rel="noopener noreferrer" // Security best practice
              >
                <FontAwesomeIcon icon={faLinkedin} /> <strong>LinkedIn</strong>
              </a>
              <a
                href="https://github.com/Haad1000" // Replace with correct GitHub URL
                className="text-black"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FontAwesomeIcon icon={faGithub} /> <strong>GitHub</strong>
              </a>
            </div>
          </div>

          {/* Profile 2 */}
          <div className="flex flex-col items-center text-center">
            <img
              src={profile2}
              alt="Creator 2"
              className="w-72 h-72 rounded-full object-cover mb-4 border-2 border-gray-300"
            />
            {/* Name in bold */}
            <h3 className="text-xl font-bold">Dhairya Kachalia</h3>
            {/* About Me */}
            <p className="text-gray-600 mt-2">I'm a sophomore majoring in Computer Science. I've been coding for four years in object-oriented languages like Java. I have development experience with Spring Boot, Postman, and MySQL, and I'm a TA for COM S 227.</p>
            {/* Contact Information */}
            <p className="text-gray-500 mt-4">
              <strong>Email:</strong> dhairyak@iastate.edu
            </p>
            {/* LinkedIn and GitHub with icons */}
            <div className="flex gap-4 mt-4">
              <a
                href="https://www.linkedin.com/in/dhairyakachalia/" // LinkedIn URL for Creator 2
                className="text-blue-600"
                target="_blank" 
                rel="noopener noreferrer"
              >
                <FontAwesomeIcon icon={faLinkedin} /> <strong>LinkedIn</strong>
              </a>
              <a
                href="https://github.com/dhairyak668" // GitHub URL for Creator 2
                className="text-black"
                target="_blank" 
                rel="noopener noreferrer"
              >
                <FontAwesomeIcon icon={faGithub} /> <strong>GitHub</strong>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Creators;
