import { motion } from 'framer-motion';

interface AnimatedImageProps {
  src: string;
  alt: string;
  width?: string;
  height?: string;
  delay?: number;
  duration?: number;
}

const AnimatedImage: React.FC<AnimatedImageProps> = ({
  src,
  alt,
  width = 'w-64',
  height = 'h-auto',
  delay = 0,
  duration = 0.8,
}) => {
  return (
    <motion.img
      src={src}
      alt={alt}
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay, duration, ease: 'easeOut' }}
      className={`${width} ${height}  rounded-xl`}
    />
  );
};

export default AnimatedImage;
