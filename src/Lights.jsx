import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { useHelper } from '@react-three/drei'

import {DirectionalLightHelper} from 'three'

export default function Lights()
{
    const light = useRef()
    //useHelper(light, DirectionalLightHelper, 1)
    
    useFrame((state) =>
    {
        // light.current.position.z = state.camera.position.z + 1 - 4
        // light.current.target.position.z = state.camera.position.z - 4
        // light.current.position.x = state.camera.position.x + 4
        // light.current.target.position.x = state.camera.position.x + 1
        // light.current.target.updateMatrixWorld()
    })

    return <>
        <directionalLight
            ref={ light }
            castShadow
            position={ [ 8, 8, 1 ] }
            intensity={ 1.5 }
            shadow-mapSize={ [ 800, 800 ] }
            shadow-camera-near={ 1 }
            shadow-camera-far={ 30 }
            shadow-camera-top={ 10 }
            shadow-camera-right={ 11 }
            shadow-camera-bottom={ -10 }
            shadow-camera-left={ -11 }
        />
        <ambientLight intensity={ 0.5 } />
    </>
}