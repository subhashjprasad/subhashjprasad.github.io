import { useRapier, RigidBody, CuboidCollider, vec3, euler, quat } from '@react-three/rapier'
import { useFrame } from '@react-three/fiber'
import { useKeyboardControls, useGLTF, useAnimations } from '@react-three/drei'
import { useState, useEffect, useRef } from 'react'
import * as THREE from 'three'
import ChargingEffect from './ChargingEffect'

export default function Player() {
    const body = useRef()
    const [subscribeKeys, getKeys] = useKeyboardControls()
    const { rapier, world } = useRapier()
    const [smoothedCameraPosition] = useState(() => new THREE.Vector3(0, 5, 5))
    const [smoothedCameraTarget] = useState(() => new THREE.Vector3())
    const [isCharging, setIsCharging] = useState(false) // State to track charging effect visibility
    let startTime = 0
    let flipped = false

    let animation_state = "idle"

    const jumpUp = (chargeDuration) => {
        const origin = body.current.translation()
        origin.y -= 0.1
        const direction = { x: 0, y: -1, z: 0 }
        const ray = new rapier.Ray(origin, direction)
        const hit = world.castRay(ray, 10, true)

        if (hit.toi < 0.15) {
            if (!flipped) {
                const jumpImpulse = 1 + chargeDuration * 1
                body.current.applyImpulse({ x: 0, y: jumpImpulse, z: 0 })
            }
        }
    }

    const reset = () => {
        body.current.setTranslation({ x: 0, y: 1, z: 0 })
        body.current.setLinvel({ x: 0, y: 0, z: 0 })
        body.current.setAngvel({ x: 0, y: 0, z: 0 })
    }

    useFrame((state, delta) => {
        const { forward, backward, leftward, rightward, jump } = getKeys()

        const impulse = { x: 0, y: 0, z: 0 }
        const torque = { x: 0, y: 0, z: 0 }

        const torqueStrength = 0.4 * delta
        const initial_speed = 1.5 * delta

        const quaternion = quat(body.current.rotation())
        const eulerRot = euler().setFromQuaternion(quaternion)

        const zChangeBefore = ((quaternion.angleTo(quat()) / Math.PI) - 0.5) * 2 * initial_speed
        const xChangeBefore = (eulerRot.y / (Math.PI / 2)) * initial_speed
        const speed = initial_speed - (Math.abs(Math.abs(zChangeBefore) - Math.abs(xChangeBefore)) * 0.3)

        const zChange = (zChangeBefore / initial_speed) * speed
        const xChange = (xChangeBefore / initial_speed) * speed

        flipped = Math.abs(eulerRot.z) > 0.5 && Math.abs(eulerRot.z) < 2.64

        // Check if the character is on the ground
        const origin = body.current.translation()
        origin.y -= 0.1
        const direction = { x: 0, y: -1, z: 0 }
        const ray = new rapier.Ray(origin, direction)
        const hit = world.castRay(ray, 10, true)

        const isOnGround = hit && hit.toi < 0.15

        if (isOnGround) {
            body.current.setLinearDamping(6)  // On the ground, normal damping
        } else {
            body.current.setLinearDamping(0)  // In the air, no damping
        }

        if (jump && !flipped) {
            if (animation_state !== "charging") {
                chargeAnimation.timeScale = 3
                prev_animation.fadeOut(0.5)
                chargeAnimation.reset().fadeIn(0.5).play()
                chargeAnimation.loop = false
                chargeAnimation.clampWhenFinished = true
                chargeAnimation.setLoop(THREE.LoopOnce)
                animation_state = "charging"
                prev_animation = chargeAnimation
                setIsCharging(true)
                startTime = state.clock.getElapsedTime()
            }
        } else if (animation_state === "charging") {
            const chargeDuration = state.clock.getElapsedTime() - startTime
            jumpUp(chargeDuration)

            prev_animation.fadeOut(0.5)
            idleAnimation.reset().fadeIn(0.5).play()
            animation_state = "idle"
            prev_animation = idleAnimation
            setIsCharging(false)
        } else {
        
            if (forward && !flipped) {
                impulse.x += xChange
                impulse.z -= zChange

                if (animation_state !== "walking_forward") {
                    walkingAnimation.timeScale = 3
                    prev_animation.fadeOut(0.5)
                    walkingAnimation.reset().fadeIn(0.5).play()
                    animation_state = "walking_forward"
                    prev_animation = walkingAnimation
                }
            } else if (animation_state === "walking_forward") {
                prev_animation.fadeOut(0.5)
                idleAnimation.reset().fadeIn(0.5).play()
                animation_state = "idle"
                prev_animation = idleAnimation
            }

            if (rightward && !flipped) {
                torque.y -= torqueStrength

                if (animation_state !== "walking_right" && !forward && !backward) {
                    walkingSideAnimation.timeScale = -3
                    prev_animation.fadeOut(0.5)
                    walkingSideAnimation.reset().fadeIn(0.5).play()
                    animation_state = "walking_right"
                    prev_animation = walkingSideAnimation
                }
            } else if (animation_state === "walking_right") {
                prev_animation.fadeOut(0.5)
                idleAnimation.reset().fadeIn(0.5).play()
                animation_state = "idle"
                prev_animation = idleAnimation
            }

            if (backward && !flipped) {
                impulse.x -= xChange
                impulse.z += zChange

                if (animation_state !== "walking_backward") {
                    walkingAnimation.timeScale = -3
                    prev_animation.fadeOut(0.5)
                    walkingAnimation.reset().fadeIn(0.5).play()
                    animation_state = "walking_backward"
                    prev_animation = walkingAnimation
                }
            } else if (animation_state === "walking_backward") {
                prev_animation.fadeOut(0.5)
                idleAnimation.reset().fadeIn(0.5).play()
                animation_state = "idle"
                prev_animation = idleAnimation
            }

            if (leftward && !flipped) {
                torque.y += torqueStrength

                if (animation_state !== "walking_left" && !forward && !backward) {
                    walkingSideAnimation.timeScale = 3
                    prev_animation.fadeOut(0.5)
                    walkingSideAnimation.reset().fadeIn(0.5).play()
                    animation_state = "walking_left"
                    prev_animation = walkingSideAnimation
                }
            } else if (animation_state === "walking_left") {
                prev_animation.fadeOut(0.5)
                idleAnimation.reset().fadeIn(0.5).play()
                animation_state = "idle"
                prev_animation = idleAnimation
            }
        }

        if (!flipped) {
            const currentVelocity = body.current.linvel()
            const currentSpeed = Math.sqrt(currentVelocity.x ** 2 + currentVelocity.z ** 2)
            const maxSpeed = 1.3
            if (currentSpeed < maxSpeed) {
                body.current.applyImpulse(impulse)
            }
            body.current.applyTorqueImpulse(torque)
        }

        const currentVelocity = body.current.linvel()
        const maxFallSpeed = -30
        if (currentVelocity.y < maxFallSpeed) {
            body.current.setLinvel({ x: currentVelocity.x, y: maxFallSpeed, z: currentVelocity.z })
        }

        const bodyPosition = body.current.translation()
        const cameraPosition = new THREE.Vector3().copy(bodyPosition).add(new THREE.Vector3(0, 8, 8))
        const cameraTarget = new THREE.Vector3().copy(bodyPosition)

        smoothedCameraPosition.lerp(cameraPosition, 5 * delta)
        smoothedCameraTarget.lerp(cameraTarget, 5 * delta)

        state.camera.position.copy(smoothedCameraPosition)
        state.camera.lookAt(smoothedCameraTarget)
    })

    const dino = useGLTF('./Dino/Dino.glb')

    dino.scene.traverse((child) => {
        if (child.isMesh) {
            child.castShadow = true
        }
    })

    const animations = useAnimations(dino.animations, dino.scene)
    const walkingAnimation = animations.actions.walk
    const idleAnimation = animations.actions.idle
    const walkingSideAnimation = animations.actions.side
    const chargeAnimation = animations.actions.charge
    let prev_animation = idleAnimation

    return (
        <RigidBody
            ref={body}
            canSleep={false}
            colliders={false}
            restitution={0.6}
            friction={0}  
            linearDamping={6}
            angularDamping={10}
            position={[0, 1, 0]}
            gravityScale={3}
        >
            <primitive object={dino.scene} scale={0.1} />
            <CuboidCollider args={[0.2, 0.2, 0.35]} position={[0, 0.2, -0.15]} castShadow />
            <CuboidCollider args={[0.1, 0.2, 0.15]} position={[0, 0.5, 0.35]} castShadow />
            {isCharging && <ChargingEffect position={[0, 0.01, 0]} />}
        </RigidBody>
    )
}
