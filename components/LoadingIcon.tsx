import {motion} from 'framer-motion'

const LoadingIcon = () => (
  <motion.div
    className='w-8 h-8 border-4 border-white/30 border-t-white rounded-full'
    animate={{rotate: 360}}
    transition={{
      duration: 1,
      repeat: Infinity,
      ease: 'linear',
    }}
  />
)

export default LoadingIcon
