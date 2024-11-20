import { useRef, useEffect, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

let ringColor = new THREE.Color(0xffffff)

function ChargingEffect({ position }) {
    const group = useRef()
    const maxRadius = 1
    const gap = 0.1
    const speed = 0.5
    const spawnInterval = 0.25 // Interval at which new rings should be created
    const [lastSpawnTime, setLastSpawnTime] = useState(0)

    const createRing = (startTime) => {
        const outerRadius = maxRadius
        const innerRadius = outerRadius - gap
        const geometry = new THREE.RingGeometry(innerRadius, outerRadius, 32)
        const material = new THREE.MeshBasicMaterial({ color: ringColor, side: THREE.DoubleSide, transparent: true })
        material.opacity = 0
        const ring = new THREE.Mesh(geometry, material)
        ring.userData = {
            initialRadius: outerRadius,
            speed: speed,
            startTime: startTime
        }
        group.current.add(ring)
    }

    useFrame((state, delta) => {
        if (group.current) {
            const elapsed = state.clock.elapsedTime
            const rings = group.current.children

            // Iterate over the rings in reverse order to safely remove elements while iterating
            for (let idx = rings.length - 1; idx >= 0; idx--) {
                const ring = rings[idx]
                const progress = (elapsed - ring.userData.startTime) * ring.userData.speed
                const currentScale = 1 - (progress % 1)
                ring.scale.setScalar(currentScale * ring.userData.initialRadius)
                ring.position.set(0, 0, 0)

                ring.material.opacity = 1 - currentScale

                if (progress > 1) {
                    group.current.remove(ring)
                }
            }

            // Check if a new ring should be created based on spawnInterval
            if (elapsed - lastSpawnTime > spawnInterval) {
                if (rings.length > 0) {
                    const leadingRing = rings[rings.length - 1]
                    const leadingRingProgress = (elapsed - leadingRing.userData.startTime) * leadingRing.userData.speed
                    if (leadingRingProgress > 0.25) {
                        ringColor.g = Math.max(ringColor.g - 0.1, 0)
                        ringColor.b = Math.max(ringColor.b - 0.1, 0)
                        createRing(elapsed)
                        setLastSpawnTime(elapsed)
                    }
                } else {
                    ringColor.g = 1
                    ringColor.b = 1
                    createRing(elapsed)
                    setLastSpawnTime(elapsed)
                }
            }
        }
    })

    return (
        <group ref={group} position={position} rotation={[-Math.PI / 2, 0, 0]} /> // Rotate to lay flat on the ground
    )
}

export default ChargingEffect
