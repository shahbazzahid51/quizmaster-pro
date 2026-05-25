import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  HiHome,
  HiCollection,
  HiChartBar,
  HiStar,
  HiHeart,
  HiMail,
  HiPhone,
  HiLocationMarker
} from 'react-icons/hi';

import {
  FaFacebook,
  FaTwitter,
  FaInstagram,
  FaLinkedin,
  FaGithub
} from 'react-icons/fa';
const Footer = () => {
  const { isAuthenticated } = useAuth();
  const currentYear = new Date().getFullYear();

  const quickLinks = [
    { name: 'Home', path: '/', icon: HiHome },
    { name: 'Categories', path: '/categories', icon: HiCollection },
    { name: 'Leaderboard', path: '/leaderboard', icon: HiStar },
    ...(isAuthenticated ? [{ name: 'Dashboard', path: '/dashboard', icon: HiChartBar }] : [])
  ];

 const socialLinks = [
  { name: 'Facebook', icon: FaFacebook, url: 'https://facebook.com', color: 'hover:text-blue-600' },
  { name: 'Twitter', icon: FaTwitter, url: 'https://twitter.com', color: 'hover:text-blue-400' },
  { name: 'Instagram', icon: FaInstagram, url: 'https://instagram.com', color: 'hover:text-pink-600' },
  { name: 'LinkedIn', icon: FaLinkedin, url: 'https://linkedin.com', color: 'hover:text-blue-700' },
  { name: 'GitHub', icon: FaGithub, url: 'https://github.com', color: 'hover:text-gray-700 dark:hover:text-gray-300' }
];

  return (
    <footer className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 mt-auto">
      <div className="container-custom py-8 md:py-12">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="col-span-1 md:col-span-1">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-r from-primary-500 to-primary-700 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">Q</span>
              </div>
              <span className="text-lg font-bold bg-gradient-to-r from-primary-600 to-primary-800 dark:from-primary-400 dark:to-primary-600 bg-clip-text text-transparent">
                QuizMaster Pro
              </span>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              Test your knowledge, track your progress, and compete with learners worldwide.
            </p>
            <div className="flex space-x-3">
              {socialLinks.map((social) => {
                const Icon = social.icon;
                return (
                  <a
                    key={social.name}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`text-gray-500 dark:text-gray-400 ${social.color} transition-all duration-200 transform hover:scale-110`}
                    aria-label={social.name}
                  >
                    <Icon className="w-5 h-5" />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider mb-4">
              Quick Links
            </h3>
            <ul className="space-y-2">
              {quickLinks.map((link) => {
                const Icon = link.icon;
                return (
                  <li key={link.name}>
                    <Link
                      to={link.path}
                      className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors duration-200"
                    >
                      <Icon className="w-4 h-4" />
                      <span>{link.name}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider mb-4">
              Contact
            </h3>
            <ul className="space-y-2">
              <li className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                <HiMail className="w-4 h-4 flex-shrink-0" />
                <span>support@quizmasterpro.com</span>
              </li>
              <li className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                <HiPhone className="w-4 h-4 flex-shrink-0" />
                <span>+1 (555) 123-4567</span>
              </li>
              <li className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                <HiLocationMarker className="w-4 h-4 flex-shrink-0" />
                <span>123 Learning St, Education City, EC 12345</span>
              </li>
            </ul>
          </div>

          {/* Newsletter / About */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider mb-4">
              About Us
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
              QuizMaster Pro is a modern quiz platform designed to make learning fun and interactive.
            </p>
            <div className="flex items-center space-x-1 text-sm text-gray-500 dark:text-gray-500">
              <HiHeart className="w-4 h-4 text-red-500 animate-pulse" />
              <span>Made with passion for learning</span>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-800">
          <div className="flex flex-col sm:flex-row justify-between items-center space-y-3 sm:space-y-0">
            <p className="text-xs text-gray-500 dark:text-gray-400">
              &copy; {currentYear} QuizMaster Pro. All rights reserved.
            </p>
            <div className="flex space-x-6">
              <Link
                to="/privacy"
                className="text-xs text-gray-500 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
              >
                Privacy Policy
              </Link>
              <Link
                to="/terms"
                className="text-xs text-gray-500 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
              >
                Terms of Service
              </Link>
              <Link
                to="/contact"
                className="text-xs text-gray-500 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
              >
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;