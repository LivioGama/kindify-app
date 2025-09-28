'use client'

import {motion} from 'framer-motion'
import {useEffect, useState} from 'react'

interface Orb {
  id: number
  x: number
  y: number
  size: number
  delay: number
  armIndex: number
  distanceFromCenter: number
  angle: number
}

interface DustParticle {
  id: number
  x: number
  y: number
  size: number
  delay: number
}

// New color palette matching herofull.png design
const colors = {
  // Background gradients
  bgCenter: '#6B7BC7', // Light blue-purple center
  bgMid: '#5A6BB8', // Medium blue-purple
  bgOuter: '#4A5AAA', // Deep blue-purple edges
  bgDeepest: '#3A4A9A', // Deepest blue-purple

  // Particle colors
  warmOrange: '#FF8A65', // Warm orange particles
  warmPink: '#FF7B8E', // Pink particles
  warmYellow: '#FFD54F', // Yellow particles
  coolCyan: '#4FC3F7', // Cool cyan particles
  coolTeal: '#26C6DA', // Teal particles
  coolMint: '#66BB6A', // Mint green particles

  // UI elements
  white: '#FFFFFF', // Pure white
  ringColor: 'rgba(255, 255, 255, 0.1)', // Semi-transparent rings
}

interface CosmicBackgroundProps {
  isListening?: boolean
  isSpeaking?: boolean
}

export default function CosmicBackground({
  isListening = false,
  isSpeaking = false,
}: CosmicBackgroundProps) {
  const [orbs, setOrbs] = useState<Orb[]>([])
  const [dustParticles, setDustParticles] = useState<DustParticle[]>([])

  useEffect(() => {
    const newOrbs: Orb[] = []
    const numArms = 3 // Fewer arms for clearer spiral
    const particlesPerArm = 45 // More particles per arm
    const spiralTightness = 0.25 // Tighter spiral
    const armAngleOffset = (Math.PI * 2) / numArms

    for (let arm = 0; arm < numArms; arm++) {
      const armBaseAngle = arm * armAngleOffset

      for (let i = 0; i < particlesPerArm; i++) {
        // Create more dramatic spiral
        const distance = 20 + Math.pow(i, 1.4) * 8 // Exponential distance for better spiral
        const spiralAngle = armBaseAngle + i * spiralTightness + Math.pow(i, 0.7) * 0.1 // Progressive angle

        const x = distance * Math.cos(spiralAngle)
        const y = distance * Math.sin(spiralAngle)

        // Reduce randomness to maintain spiral structure
        const randomOffset = 2 + Math.random() * 8
        const randomAngle = Math.random() * Math.PI * 2
        const finalX = x + Math.cos(randomAngle) * randomOffset
        const finalY = y + Math.sin(randomAngle) * randomOffset

        // Vary particle size based on distance for depth
        const size = Math.max(1.5, 4 - distance / 200)

        newOrbs.push({
          id: arm * 100 + i,
          x: finalX,
          y: finalY,
          size,
          delay: Math.random() * 3,
          armIndex: arm,
          distanceFromCenter: distance,
          angle: spiralAngle,
        })
      }
    }
    setOrbs(newOrbs)

    const newDust: DustParticle[] = []
    for (let i = 0; i < 15; i++) {
      newDust.push({
        id: i,
        x: Math.random() * 2000 - 1000,
        y: Math.random() * 2000 - 1000,
        size: 1 + Math.random() * 1.5,
        delay: Math.random() * 12,
      })
    }
    setDustParticles(newDust)
  }, [])

  return (
    <div
      className={`cosmic-background ${isListening ? 'listening' : ''} ${isSpeaking ? 'speaking' : ''}`}>
      {/* Layer A-E: Multi-layered gradient system */}
      <div className='absolute inset-0'>
        {/* Layer A: Center radial core (luminous) */}
        <div className='absolute inset-0 center-core' />

        {/* Layer B: Inner-mid wash */}
        <div className='absolute inset-0 inner-mid-wash' />

        {/* Layer C: Outer vignette */}
        <div className='absolute inset-0 outer-vignette' />

        {/* Layer D: Conic/angular color accents */}
        <div className='absolute inset-0 conic-accents' />

        {/* Layer E: Subtle noise texture */}
        <div className='absolute inset-0 noise-texture' />
      </div>

      {/* Dust particles */}
      <div className='absolute inset-0 flex items-center justify-center'>
        {dustParticles.map(dust => (
          <motion.div
            key={`dust-${dust.id}`}
            className='absolute rounded-full'
            style={{
              width: dust.size,
              height: dust.size,
              left: `calc(50% + ${dust.x}px)`,
              top: `calc(50% + ${dust.y}px)`,
              backgroundColor: colors.coolCyan,
              opacity: 0.1,
            }}
            animate={{
              opacity: [0.05, 0.15, 0.05],
              scale: [0.8, 1.2, 0.8],
            }}
            transition={{
              duration: 8 + Math.random() * 4,
              repeat: Infinity,
              delay: dust.delay,
              ease: 'easeInOut',
            }}
          />
        ))}
      </div>

      {/* Spiral arms with orbs */}
      <div className='absolute inset-0 flex items-center justify-center'>
        <motion.div
          animate={{
            rotate: [0, 360],
          }}
          transition={{
            duration: isListening ? 120 : 150, // Much slower, more subtle rotation
            repeat: Infinity,
            ease: 'linear',
          }}>
          {orbs.map(orb => {
            // Assign colors based on ring and position for variety
            const ringIndex = orb.armIndex // Now represents ring index
            const particleColors = [
              colors.warmOrange,
              colors.warmPink,
              colors.warmYellow,
              colors.coolCyan,
              colors.coolTeal,
              colors.coolMint,
            ]

            // Create color variety within each ring
            const colorIndex = (orb.id + ringIndex * 2) % particleColors.length
            const orbColor = particleColors[colorIndex]

            // Opacity varies by ring distance - closer rings are more prominent
            const baseOpacity = Math.max(0.3, 1 - ringIndex * 0.15)
            const orbOpacity = baseOpacity + Math.random() * 0.2

            return (
              <motion.div
                key={`orb-${orb.id}`}
                className='absolute rounded-full'
                style={{
                  width: orb.size,
                  height: orb.size,
                  left: `calc(50% + ${orb.x}px - ${orb.size / 2}px)`,
                  top: `calc(50% + ${orb.y}px - ${orb.size / 2}px)`,
                  backgroundColor: orbColor,
                  boxShadow: `0 0 ${orb.size * 2}px ${orbColor}`,
                  opacity: orbOpacity,
                }}
                animate={{
                  scale: isListening ? [0.8, 1.3, 0.8] : [0.8, 1.2, 0.8],
                  opacity: isListening ? [0.6, 1, 0.6] : [0.6, 1, 0.6],
                  x: [0, Math.sin(orb.id) * 5, 0],
                  y: [0, Math.cos(orb.id) * 5, 0],
                }}
                transition={{
                  duration: isListening ? 2.5 : 3 + orb.delay,
                  repeat: Infinity,
                  ease: 'easeInOut',
                  delay: orb.delay,
                }}
              />
            )
          })}
        </motion.div>
      </div>

      <style jsx>{`
        .cosmic-background {
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          overflow: hidden;
          z-index: -1;
        }

        /* Layer A: Center radial core */
        .center-core {
          background: radial-gradient(
            circle at center,
            ${colors.bgCenter} 0%,
            ${colors.bgMid} 30%,
            ${colors.bgOuter} 60%,
            ${colors.bgDeepest} 100%
          );
          animation: breathe 20s ease-in-out infinite;
        }

        .listening .center-core {
          animation: breatheActive 12s ease-in-out infinite;
          filter: brightness(1.12);
        }

        .speaking .center-core {
          animation: speakPulse 1s ease-out;
        }

        /* Layer B: Subtle ring overlays */
        .inner-mid-wash {
          background:
            radial-gradient(
              circle at center,
              transparent 118px,
              ${colors.ringColor} 120px,
              transparent 122px
            ),
            radial-gradient(
              circle at center,
              transparent 178px,
              ${colors.ringColor} 180px,
              transparent 182px
            ),
            radial-gradient(
              circle at center,
              transparent 238px,
              ${colors.ringColor} 240px,
              transparent 242px
            ),
            radial-gradient(
              circle at center,
              transparent 298px,
              ${colors.ringColor} 300px,
              transparent 302px
            ),
            radial-gradient(
              circle at center,
              transparent 378px,
              ${colors.ringColor} 380px,
              transparent 382px
            ),
            radial-gradient(
              circle at center,
              transparent 458px,
              ${colors.ringColor} 460px,
              transparent 462px
            );
        }

        /* Layer C: Outer vignette for depth */
        .outer-vignette {
          background: radial-gradient(
            circle at center,
            transparent 40%,
            rgba(58, 74, 154, 0.3) 70%,
            rgba(58, 74, 154, 0.6) 90%,
            rgba(58, 74, 154, 0.9) 100%
          );
        }

        /* Layer D: Subtle particle glow enhancement */
        .conic-accents {
          background: radial-gradient(
            circle at center,
            rgba(255, 255, 255, 0.05) 0%,
            transparent 20%
          );
          animation: accentPulse 30s ease-in-out infinite;
        }

        /* Layer E: Subtle noise texture */
        .noise-texture {
          background-image:
            radial-gradient(circle at 20% 50%, rgba(255, 255, 255, 0.02) 0%, transparent 50%),
            radial-gradient(circle at 80% 20%, rgba(255, 255, 255, 0.02) 0%, transparent 50%),
            radial-gradient(circle at 40% 80%, rgba(255, 255, 255, 0.02) 0%, transparent 50%);
          opacity: 0.4;
        }

        @keyframes breathe {
          0%,
          100% {
            filter: brightness(0.94);
          }
          50% {
            filter: brightness(1.06);
          }
        }

        @keyframes accentPulse {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }

        /* Enhanced animations for listening state */

        .speaking .conic-accents {
          animation: speakAccentPulse 0.6s ease-out;
        }

        @keyframes speakPulse {
          0% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.06);
          }
          100% {
            transform: scale(1);
          }
        }

        @keyframes speakAccentPulse {
          0%,
          100% {
            opacity: 0.03;
          }
          50% {
            opacity: 0.08;
          }
        }

        @keyframes breatheActive {
          0%,
          100% {
            filter: brightness(1);
          }
          50% {
            filter: brightness(1.1);
          }
        }
      `}</style>
    </div>
  )
}
