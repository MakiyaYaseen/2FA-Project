// src/components/AnimatedAuth.jsx
import { motion } from 'framer-motion';
import './AnimatedAuth.css';

const AnimatedAuth = ({ children }) => (
  <motion.div
    initial={{ opacity: 0, y: 50 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, type: 'spring' }}
    className="auth-animated-container"
  >
    {children}
  </motion.div>
);

export default AnimatedAuth;
