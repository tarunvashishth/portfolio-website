import React, { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { FiCheck } from 'react-icons/fi';

import './Toaster.scss';

const listeners = new Set();
let nextId = 0;

export const toast = (message) => {
  nextId += 1;
  const item = { id: nextId, message };
  listeners.forEach((listener) => listener(item));
};

const Toaster = () => {
  const [items, setItems] = useState([]);

  useEffect(() => {
    const listener = (item) => {
      setItems((current) => [...current.slice(-2), item]);
      setTimeout(() => setItems((current) => current.filter((i) => i.id !== item.id)), 2800);
    };
    listeners.add(listener);
    return () => listeners.delete(listener);
  }, []);

  return (
    <div className="toaster" role="status" aria-live="polite">
      <AnimatePresence initial={false}>
        {items.map((item) => (
          <motion.div
            key={item.id}
            layout
            className="toast"
            initial={{ opacity: 0, y: 24, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.95, transition: { duration: 0.2 } }}
            transition={{ type: 'spring', stiffness: 420, damping: 30 }}
          >
            <span className="toast__icon"><FiCheck /></span>
            {item.message}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

export default Toaster;
