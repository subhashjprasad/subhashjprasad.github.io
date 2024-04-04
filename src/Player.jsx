import { useRapier, RigidBody, CuboidCollider, vec3, euler, quat } from '@react-three/rapier'
import { useFrame } from '@react-three/fiber'
import { useKeyboardControls, useGLTF, useAnimations } from '@react-three/drei'
import { useState, useEffect, useRef } from 'react'
import * as THREE from 'three'

export default function Player()
{
    const body = useRef()
    const [ subscribeKeys, getKeys ] = useKeyboardControls()
    const { rapier, world } = useRapier()
    const [ smoothedCameraPosition ] = useState(() => new THREE.Vector3(0, 5, 5))
    const [ smoothedCameraTarget ] = useState(() => new THREE.Vector3())
    var walking = false
    var fading_in = false
    var fading_out = false
    var walking_back = false
    var fading_in_back = false
    var fading_out_back = false
    var flipped = false

    const jump = () =>
    {
        const origin = body.current.translation()
        origin.y -= 0.1
        const direction = { x: 0, y: - 1, z: 0 }
        const ray = new rapier.Ray(origin, direction)
        const hit = world.castRay(ray, 10, true)

        if(hit.toi < 0.15)
        {
            if (!flipped) { body.current.applyImpulse({ x: 0, y: 1.8, z: 0 }) }
        }
    }
    
    const reset = () =>
    {
        body.current.setTranslation({ x: 0, y: 1, z: 0 })
        body.current.setLinvel({ x: 0, y: 0, z: 0 })
        body.current.setAngvel({ x: 0, y: 0, z: 0 })
    }

    useEffect(() =>
    {
        const unsubscribeJump = subscribeKeys(
            (state) => state.jump,
            (value) =>
            {
                if(value)
                    jump()
            }
        )

        return () =>
        {
            unsubscribeJump()
        }
    }, [])

    useFrame((state, delta) =>
    {
        /**
         * Controls
         */

        if (fading_in) {
            // animations.actions.walk.play()
            // animations.actions.walk.crossFadeFrom(animations.actions.Action, 0.1)
            walkingAnimation.timeScale = 3
            standingAnimation.fadeOut(0.5)
            walkingAnimation.reset().fadeIn(0.5).play()
            fading_in = false
            walking = true
        } else if (fading_out) {
            // animations.actions.Action.play()
            // animations.actions.Action.crossFadeFrom(animations.actions.walk, 0.1)
            walkingAnimation.fadeOut(0.5)
            standingAnimation.reset().fadeIn(0.5).play()
            fading_out = false
            walking = false
        }
        if (fading_in_back) {
            // animations.actions.walk.play()
            // animations.actions.walk.crossFadeFrom(animations.actions.Action, 0.1)
            walkingAnimation.timeScale = -3
            standingAnimation.fadeOut(0.5)
            walkingAnimation.reset().fadeIn(0.5).play()
            fading_in_back = false
            walking_back = true
        } else if (fading_out_back) {
            // animations.actions.Action.play()
            // animations.actions.Action.crossFadeFrom(animations.actions.walk, 0.1)
            walkingAnimation.fadeOut(0.5)
            standingAnimation.reset().fadeIn(0.5).play()
            fading_out_back = false
            walking_back = false
        }

        const { forward, backward, leftward, rightward } = getKeys()

        const impulse = { x: 0, y: 0, z: 0 }
        const torque = { x: 0, y: 0, z: 0 }

        const torqueStrength = 0.5 * delta
        const initial_speed = 1.5 * delta

        const quaternion = quat(body.current.rotation())
        const axis = new THREE.Quaternion();
        const eulerRot = euler().setFromQuaternion(quaternion)

        const zChangeBefore = ((axis.angleTo(quaternion) / Math.PI) - 0.5) * 2 * initial_speed
        const xChangeBefore = (eulerRot.y / (Math.PI / 2)) * initial_speed
        const speed = initial_speed - (Math.abs(Math.abs(zChangeBefore) - Math.abs(xChangeBefore)) * 0.3)

        const zChange = (zChangeBefore / initial_speed) * speed
        const xChange = (xChangeBefore / initial_speed) * speed

        if (Math.abs(eulerRot.z) > 0.5 && Math.abs(eulerRot.z) < 2.64) {flipped = true}
        else {flipped = false}

        if(forward)
        {
            impulse.x += xChange
            impulse.z -= zChange

            if (!fading_in && !walking) {fading_in = true}
        } else if (!fading_out && walking) {fading_out = true}

        if(rightward)
        {
            //impulse.x += impulseStrength
            torque.y -= torqueStrength
        }

        if(backward)
        {
            impulse.x -= xChange
            impulse.z += zChange

            if (!fading_in_back && !walking_back) {fading_in_back = true}
        } else if (!fading_out_back && walking_back) {fading_out_back = true}
        
        if(leftward)
        {
            //impulse.x -= impulseStrength
            torque.y += torqueStrength
        }

        if (!flipped) {
            body.current.applyImpulse(impulse)
            body.current.applyTorqueImpulse(torque)
        }

        /**
         * Camera
         */
        const bodyPosition = body.current.translation()
    
        const cameraPosition = new THREE.Vector3()
        cameraPosition.copy(bodyPosition)
        //cameraPosition.x += 5
        cameraPosition.y += 8
        cameraPosition.z += 8

        const cameraTarget = new THREE.Vector3()
        cameraTarget.copy(bodyPosition)

        smoothedCameraPosition.lerp(cameraPosition, 5 * delta)
        smoothedCameraTarget.lerp(cameraTarget, 5 * delta)

        state.camera.position.copy(smoothedCameraPosition)
        state.camera.lookAt(smoothedCameraTarget)
    })

    const dino = useGLTF('./Dino/DinoWalk.glb')

    dino.scene.traverse(function (child) {
        if (child.isMesh) {
          child.castShadow = true;
        }
     });
     
    const animations = useAnimations(dino.animations, dino.scene)

    const walkingAnimation = animations.actions.walk
    const standingAnimation = animations.actions.Action

    return <RigidBody
        ref={ body }
        canSleep={ false }
        colliders={ false }
        restitution={ 0.6 }
        friction={ 0 } 
        linearDamping={ 6 }
        angularDamping={ 10 }
        position={ [ 0, 1, 0 ] }
        gravityScale={ 3 }
    >
        {/* <mesh castShadow>
            <icosahedronGeometry args={ [ 0.3, 1 ] } />
            <meshStandardMaterial flatShading color="#F0F7F4" />
        </mesh> */}

    <primitive object={ dino.scene } scale={ 0.1 }/>
    <CuboidCollider args={ [0.2, 0.2, 0.35] } position={[0, 0.2, -0.15]} castShadow/>
    <CuboidCollider args={ [0.1, 0.2, 0.15] } position={[0, 0.5, 0.35]} castShadow/>
    </RigidBody>
}