'use client'

import {motion, AnimatePresence} from 'framer-motion'
import Image from 'next/image'
import {useVapi} from '@/hooks/useVapi'
import MicIcon from '@/components/MicIcon'
import StopIcon from '@/components/StopIcon'
import LoadingIcon from '@/components/LoadingIcon'
import CosmicSwirl from '@/components/CosmicSwirl'

export default function Home() {
  const {state, politeText, isAnimating, handleClick} = useVapi()

  return (
    <>
      {/* SEO Structured Data */}
      <script
        type='application/ld+json'
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'WebPage',
            name: 'Kindify AI Voice Assistant',
            description: 'AI-powered voice assistant for kinder communication',
            url: 'https://kindify.app',
            mainEntity: {
              '@type': 'SoftwareApplication',
              name: 'Kindify',
              applicationCategory: 'CommunicationApplication',
              operatingSystem: 'Web',
              offers: {
                '@type': 'Offer',
                price: '0',
                priceCurrency: 'USD',
              },
            },
          }),
        }}
      />

      <div className='relative w-full h-screen overflow-hidden flex items-center justify-center'>
        {/* Cosmic animated background */}
        <CosmicSwirl />

        {/* Logo */}
        <Image
          src='/logo.webp'
          alt='Logo'
          width={256}
          height={256}
          className='absolute top-8 left-1/2 transform -translate-x-1/2 z-20'
        />

        {/* Polite text display */}
        <AnimatePresence>
          {politeText && (
            <motion.div
              initial={{opacity: 0, scale: 0.8}}
              animate={{opacity: 1, scale: 1}}
              exit={{opacity: 0, scale: 0.8}}
              className='absolute bottom-32 left-1/2 transform -translate-x-1/2 text-center text-white text-2xl font-semibold z-10 max-w-md'>
              {politeText}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Microphone button */}
        <motion.button
          onClick={handleClick}
          disabled={state === 'connecting'}
          className='relative z-10 w-32 h-32 rounded-full bg-gradient-to-r from-blue-500 to-green-500 flex items-center justify-center shadow-lg disabled:opacity-50'
          animate={
            isAnimating
              ? {
                  scale: [1, 1.2, 1],
                  rotate: [0, 5, -5, 0],
                }
              : {}
          }
          transition={{
            type: 'spring',
            stiffness: 300,
            repeat: isAnimating ? Infinity : 0,
          }}>
          {state === 'idle' ? (
            <MicIcon />
          ) : state === 'connecting' ? (
            <LoadingIcon />
          ) : state === 'listening' ? (
            <MicIcon />
          ) : (
            <StopIcon />
          )}
        </motion.button>

        {/* Status indicator */}
        <div className='absolute top-1/2 left-1/2 transform -translate-x-1/2 translate-y-20 text-white text-2xl opacity-75 font-bold'>
          {state === 'connecting' && 'Connecting...'}
          {state === 'listening' && 'Listening...'}
          {state === 'user-speaking' && 'AI Speaking...'}
          {state === 'processing' && 'Listening...'}
        </div>
      </div>
    </>
  )
}
