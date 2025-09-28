'use client'

import {useRef, useMemo} from 'react'
import {useFrame, Canvas} from '@react-three/fiber'
import * as THREE from 'three'

interface ParticleData {
  angle: number
  radius: number
  speed: number
  color: THREE.Color
  size: number
  trail: THREE.Vector3[]
}

function ParticleSystem() {
  const particlesRef = useRef<THREE.Points>(null!)
  const trailsRef = useRef<THREE.Group>(null!)

  // Create particle data
  const particleData = useMemo(() => {
    const data: ParticleData[] = []
    const colors = [
      new THREE.Color('#FF69B4'), // hot pink
      new THREE.Color('#00BFFF'), // deep sky blue
      new THREE.Color('#FFFFFF'), // white
      new THREE.Color('#FFD700'), // gold
      new THREE.Color('#FF6347'), // tomato
      new THREE.Color('#9370DB'), // medium purple
      new THREE.Color('#00FF7F'), // spring green
      new THREE.Color('#FF1493'), // deep pink
      new THREE.Color('#00CED1'), // dark turquoise
    ]

    const circles = [
      {radius: 0.4, count: 1, speed: 0.01},
      {radius: 0.5, count: 2, speed: 0.0075},
      {radius: 0.6, count: 2, speed: 0.006},
      {radius: 0.7, count: 2, speed: 0.005},
      {radius: 0.8, count: 2, speed: 0.003},
      {
        radius: 0.9,
        count: 1,
        speed: 0.003,
      },
    ]

    let particleIndex = 0
    circles.forEach(circle => {
      for (let i = 0; i < circle.count; i++) {
        const angle = (i / circle.count) * Math.PI * 2 + (Math.random() - 0.5) * 1.2
        // Give each particle a unique radius to avoid same-orbit collisions
        const uniqueOffset = particleIndex * 0.12 + Math.random() * 0.08
        const radius = circle.radius + uniqueOffset
        // Ensure mixed rotation directions
        const direction = Math.random() > 0.5 ? 1 : -1
        data.push({
          angle,
          radius,
          speed: circle.speed * direction,
          color: colors[Math.floor(Math.random() * colors.length)],
          size: 0.12 + Math.random() * 0.08,
          trail: [],
        })
        particleIndex++
      }
    })

    return data
  }, [])

  // Create geometry for main particles
  const {particleGeometry, particleMaterial} = useMemo(() => {
    const geometry = new THREE.BufferGeometry()
    const positions = new Float32Array(particleData.length * 3)
    const colors = new Float32Array(particleData.length * 3)
    const sizes = new Float32Array(particleData.length)

    particleData.forEach((particle: ParticleData, i: number) => {
      const x = particle.radius * Math.cos(particle.angle)
      const y = particle.radius * Math.sin(particle.angle)

      positions[i * 3] = x
      positions[i * 3 + 1] = y
      positions[i * 3 + 2] = 0

      colors[i * 3] = particle.color.r
      colors[i * 3 + 1] = particle.color.g
      colors[i * 3 + 2] = particle.color.b

      sizes[i] = particle.size
    })

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))
    geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1))

    const material = new THREE.ShaderMaterial({
      uniforms: {},
      vertexShader: `
        attribute float size;
        varying vec3 vColor;

        void main() {
          vColor = color;
          vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
          gl_PointSize = size * 800.0 * (1.0 / -mvPosition.z);
          gl_Position = projectionMatrix * mvPosition;
        }
      `,
      fragmentShader: `
        varying vec3 vColor;

        void main() {
          float dist = distance(gl_PointCoord, vec2(0.5));
          if (dist > 0.5) discard;

          float alpha = 1.0 - smoothstep(0.1, 0.5, dist);
          float glow = 1.0 - smoothstep(0.0, 0.8, dist);
          vec3 glowColor = vColor * (2.0 + glow * 3.0);
          gl_FragColor = vec4(glowColor, alpha * (0.8 + glow * 0.4));
        }
      `,
      transparent: true,
      vertexColors: true,
      blending: THREE.AdditiveBlending,
    })

    return {particleGeometry: geometry, particleMaterial: material}
  }, [particleData])

  // Create trail lines
  const trailLines = useMemo(() => {
    return particleData.map((particle: ParticleData) => {
      const geometry = new THREE.BufferGeometry()
      const maxTrailLength = 1500 // Much longer trails
      const positions = new Float32Array(maxTrailLength * 3)
      const colors = new Float32Array(maxTrailLength * 3)

      geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
      geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))

      const material = new THREE.LineBasicMaterial({
        vertexColors: true,
        transparent: true,
        opacity: 0.7,
        blending: THREE.AdditiveBlending,
        linewidth: 1,
      })

      return {geometry, material, particle, currentLength: 0}
    })
  }, [particleData])

  useFrame(() => {
    // Update particle positions and trails
    const positions = particleGeometry.getAttribute('position') as THREE.BufferAttribute

    particleData.forEach((particle: ParticleData, i: number) => {
      // Update particle angle
      particle.angle += particle.speed

      // Calculate new position
      const x = particle.radius * Math.cos(particle.angle)
      const y = particle.radius * Math.sin(particle.angle)

      // Update particle position
      positions.setXYZ(i, x, y, 0)

      // Update trail
      const currentPos = new THREE.Vector3(x, y, 0)
      particle.trail.unshift(currentPos)

      // Limit trail length
      if (particle.trail.length > 1500) {
        particle.trail.pop()
      }

      // Update trail geometry
      const trailLine = trailLines[i]
      const trailPositions = trailLine.geometry.getAttribute('position') as THREE.BufferAttribute
      const trailColors = trailLine.geometry.getAttribute('color') as THREE.BufferAttribute

      particle.trail.forEach((pos: THREE.Vector3, index: number) => {
        if (index < 1500) {
          trailPositions.setXYZ(index, pos.x, pos.y, pos.z)

          const alpha = Math.pow(Math.max(0, 1 - index / particle.trail.length), 0.3) * 1.1
          trailColors.setXYZ(
            index,
            particle.color.r * alpha,
            particle.color.g * alpha,
            particle.color.b * alpha,
          )
        }
      })

      trailLine.geometry.setDrawRange(0, Math.min(particle.trail.length, 1500))
      trailPositions.needsUpdate = true
      trailColors.needsUpdate = true
    })

    positions.needsUpdate = true
  })

  return (
    <>
      {/* Main particles */}
      <points ref={particlesRef} geometry={particleGeometry} material={particleMaterial} />

      {/* Trail lines */}
      <group ref={trailsRef}>
        {trailLines.map(
          (
            trailLine: {geometry: THREE.BufferGeometry; material: THREE.LineBasicMaterial},
            index: number,
          ) => (
            <primitive
              key={index}
              object={new THREE.Line(trailLine.geometry, trailLine.material)}
            />
          ),
        )}
      </group>
    </>
  )
}

export default function CosmicSwirl() {
  return (
    <div className='fixed inset-0 overflow-hidden pointer-events-none'>
      {/* Background */}
      <div
        className='absolute inset-0'
        style={{
          background: 'radial-gradient(circle at center, #5C7C8C 0%, #345678 100%)',
        }}
      />

      {/* Three.js Canvas */}
      <Canvas
        camera={{position: [0, 0, 5], fov: 75}}
        style={{position: 'absolute', top: 0, left: 0, width: '100%', height: '100%'}}>
        <ParticleSystem />
      </Canvas>
    </div>
  )
}
