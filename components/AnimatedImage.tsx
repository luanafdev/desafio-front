import { motion } from 'framer-motion';

interface AnimatedImageProps {
  src: string;
  alt: string;
  width?: string;
  height?: string;
  delay?: number;
  duration?: number;
  direction?: 'up' | 'down';
  className?: string;
}

const AnimatedImage: React.FC<AnimatedImageProps> = ({
  src,
  alt,
  width = 'w-64',
  height = 'h-auto',
  delay = 0,
  duration = 0.8,
  direction = 'up',
  className = '',
}) => {
  const initialY = direction === 'up' ? 100 : -100;

  return (
    <motion.img
      src={src}
      alt={alt}
      initial={{ y: initialY, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay, duration, ease: 'easeOut' }}
      className={`${width} ${height} rounded-xl ${className}`}
    />
  );
};

export default AnimatedImage;
  