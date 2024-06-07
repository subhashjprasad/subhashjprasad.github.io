import * as THREE from 'three'
import { CuboidCollider, RigidBody } from '@react-three/rapier'
import { useState, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { useAnimations, useGLTF } from '@react-three/drei'

const boxGeometry = new THREE.BoxGeometry(1, 1, 1)

const floorMaterial = new THREE.MeshStandardMaterial({ color: '#2A8D5D'})
const obstacleMaterial = new THREE.MeshStandardMaterial({ color: 'orangered'})

export function BlockStart({ position = [ 0, 0, 0 ] })
{
    return <group position={ position }>
        <RigidBody type="fixed" restitution={ 0.2 } friction={ 0 }>
            <mesh 
                geometry={ boxGeometry } 
                material={ floorMaterial } 
                position={ [ 0, - 0.1, 0 ] } 
                scale={ [ 20, 0.2, 20 ] }  
                receiveShadow 
            />
        </RigidBody>
    </group>
}

export function BlockSpinner({ position = [ 0, 0, 0 ] })
{
    const obstacle = useRef()
    const [ speed ] = useState(() => (Math.random() + 0.2) * (Math.random() < 0.5 ? - 1 : 1))

    useFrame((state) =>
    {
        const time = state.clock.getElapsedTime()

        const rotation = new THREE.Quaternion()
        rotation.setFromEuler(new THREE.Euler(0, time * speed, 0))
        obstacle.current.setNextKinematicRotation(rotation)
    })

    return <group position={ position }>
        <RigidBody ref={ obstacle } type="kinematicPosition" position={ [ 0, 0.3, 0 ] } restitution={ 0.2 } friction={ 0 }>
            <mesh geometry={ boxGeometry } material={ obstacleMaterial } scale={ [ 6.5, 0.3, 0.3 ] } castShadow receiveShadow />
        </RigidBody>
    </group>
}

export function Title({position = [0, 0, 0]})
{
    const title = useGLTF('./title.glb')
    title.scene.children.forEach((mesh) =>
    {
        mesh.castShadow = true
    })

    return <group position={ position }>
        <RigidBody type="dynamic" colliders = {false} restitution={ 0.2 } friction={ 0.6 }>
            <primitive object={ title.scene } scale={ 0.1 }/>
            <CuboidCollider mass = {0.1} args={ [2.5, 0.15, 0.07] } position={[0, 0.15, 0]}/>
        </RigidBody>
    </group>
}

export function Level()
{
    return <>
        <BlockStart position={ [ 0, 0, 0 ] } />
        <BlockSpinner position={[0, 0, -5]}/>
        <Title position={[3, 3, 3]} />
    </>
}