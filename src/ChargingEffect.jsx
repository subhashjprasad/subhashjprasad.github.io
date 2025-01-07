import { useRef, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

function ChargingEffect({ position, chargeProgressRef }) {
    const particlesRef = useRef()
    const particleCount = 100
    const maxRadius = 2.5
    const speed = 1.0 // Speed at which particles move inward

    // Create initial particle positions constrained to the floor (XZ plane)
    const particles = new Float32Array(particleCount * 3)
    for (let i = 0; i < particleCount; i++) {
        const angle = Math.random() * 2 * Math.PI // Random angle around the center
        const r = Math.random() * maxRadius // Random distance from the center
        particles[i * 3] = r * Math.cos(angle) // X coordinate
        particles[i * 3 + 1] = 0 // Y is fixed (floor)
        particles[i * 3 + 2] = r * Math.sin(angle) // Z coordinate
    }

    const particleGeometry = new THREE.BufferGeometry()
    particleGeometry.setAttribute('position', new THREE.BufferAttribute(particles, 3))

    // Create dynamic colors for particles
    const colors = new Float32Array(particleCount * 3)
    for (let i = 0; i < particleCount; i++) {
        colors[i * 3] = 0 // Red
        colors[i * 3 + 1] = 1 // Green
        colors[i * 3 + 2] = 1 // Blue
    }
    particleGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))

    const particleMaterial = new THREE.PointsMaterial({
        size: 0.05,
        vertexColors: true, // Enable per-particle colors
        transparent: true,
        opacity: 1.0,
    })

    useFrame((state, delta) => {
        const cpr = chargeProgressRef.current
        const positions = particlesRef.current.geometry.attributes.position.array
        const colors = particlesRef.current.geometry.attributes.color.array

        for (let i = 0; i < particleCount; i++) {
            const index = i * 3
            const x = positions[index]
            const z = positions[index + 2]

            const distance = Math.sqrt(x * x + z * z)

            // Move particles inward on the XZ plane
            if (distance > 0.1) {
                const factor = delta * speed
                positions[index] -= (x / distance) * factor
                positions[index + 2] -= (z / distance) * factor
            } else {
                // Respawn particle at random position on the floor
                const angle = Math.random() * 2 * Math.PI
                const r = Math.random() * maxRadius
                positions[index] = r * Math.cos(angle)
                positions[index + 1] = 0 // Ensure Y remains on the floor
                positions[index + 2] = r * Math.sin(angle)
            }

            // Update particle color based on chargeProgress (0.0 to 1.0)
            colors[index] = cpr // Red increases with charge
            colors[index + 1] = 1 - cpr // Green decreases
            colors[index + 2] = 1 - cpr // Blue shifts
        }

        // Mark attributes as needing update
        particlesRef.current.geometry.attributes.position.needsUpdate = true
        particlesRef.current.geometry.attributes.color.needsUpdate = true
    })

    return (
        <points ref={particlesRef} geometry={particleGeometry} material={particleMaterial} position={position} />
    )
}

export default ChargingEffect
