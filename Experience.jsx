import { Physics } from '@react-three/rapier'
import Lights from './Lights.jsx'
import { Level } from './Level.jsx'
import Player from './Player.jsx'
import { Text3D } from '@react-three/drei'

export default function Experience()
{
    return <>

        <color args={ [ '#bdedfc' ] } attach="background" />

        <Physics debug={ false }>
            <Lights />
            <Level />
            <Player />
        </Physics>

        <Text3D 
            font="./public/fonts/helvetiker_regular.typeface.json" 
            position = {[-3, 2, 0]}
            size={ 0.5 }
            height={ 0.1 }
            curveSegments={ 12 }
            bevelEnabled
            bevelThickness={ 0.02 }
            bevelSize={ 0.02 }
            bevelOffset={ 0 }
            bevelSegments={ 5 }
        >
            WASD + Spacebar
            <meshNormalMaterial />
        </Text3D>
        <Text3D 
            font="./public/fonts/helvetiker_regular.typeface.json" 
            position = {[-2.2, 3, 0]}
            size={ 0.2 }
            height={ 0.1 }
            curveSegments={ 12 }
            bevelEnabled
            bevelThickness={ 0.02 }
            bevelSize={ 0.02 }
            bevelOffset={ 0 }
            bevelSegments={ 5 }
        >
            (still very much a work in progress)
            <meshNormalMaterial />
        </Text3D>

    </>
}