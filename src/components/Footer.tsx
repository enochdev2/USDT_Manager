import { Twitter, Github,  } from "lucide-react"; // Lucide React Icons

const Footer = () => {
  return (
    <footer className="bg-black text-white p-6 mt-8">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        {/* Left Side: Copyright */}
        <div className="text-sm">
          <p>&copy; 2025 KusamaToken. All Rights Reserved.</p>
        </div>

        {/* Right Side: Social Links */}
        <div className="flex space-x-6">
          <a
            href="https://twitter.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-blue-400 transition duration-300"
          >
            <Twitter size={24} /> {/* Lucide React Twitter Icon */}
          </a>
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-gray-300 transition duration-300"
          >
            <Github size={24} /> {/* Lucide React Github Icon */}
          </a>
          <a
            href="https://www.linkedin.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-blue-600 transition duration-300"
          >
            {/* <LinkedIn size={24} /> Lucide React LinkedIn Icon */}
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
