import React, { useEffect, useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { FirstPersonControls, Environment } from '@react-three/drei';
import { PlaneGeometry, MeshLambertMaterial, TextureLoader } from 'three';
import  {Garment} from './Garment'
import * as THREE from 'three';


// Componente para una isla individual

const ISLAND_SIZE = 5;
const ISLAND_HEIGHT = 0.12;
const SPACING = ISLAND_SIZE + 3;
const CIELINGHEIGHT = 3.5;


const Island = ({ position }: { position: [number, number, number] }) => {
  return (
    <>
      <mesh position={position}>
        <boxGeometry args={[ISLAND_SIZE, ISLAND_HEIGHT, ISLAND_SIZE]} />
        <meshLambertMaterial color="#681d6e" />
      </mesh>
      {/* Zocalo luminoso */}
      <mesh position={[position[0], position[1] - ISLAND_HEIGHT /2 - 0.025, position[2]]}>
        <boxGeometry args={[ISLAND_SIZE, 0.05, ISLAND_SIZE]} />
        <meshBasicMaterial color="#e9e8c3"/>
      </mesh>
    </>
  );
};

// Componente para el piso principal
const Floor = () => {
  return (
    <mesh position={[0, -0.1, 0]} rotation={[-Math.PI / 2, 0, 0]}>
      <planeGeometry args={[50, 50]} />
      <meshLambertMaterial color="#270870" />
    </mesh>
  );
};

const Wall = ({ position, rotation, texturePath, color }: { position: [number, number, number]; rotation: [number, number, number]; texturePath: string; color: string }) => {
  const texture = new TextureLoader().load(texturePath);
  const material = new MeshLambertMaterial({ map: texture, transparent: true }); // transparent: true por si la textura tiene áreas transparentes
  const sizeX = 50; // Ancho de la pared
  const sizeY = CIELINGHEIGHT + 0.1;

  return (
    <mesh position={position} rotation={rotation}>
      <planeGeometry args={[sizeX, sizeY]} />
      <meshLambertMaterial color={color} side={THREE.DoubleSide} />
      {/* <meshLambertMaterial map={texture} transparent={true} side={THREE.DoubleSide} />  */}
    </mesh>
  );
};

// Componente para el cielorrazo
const Ceiling = () => {
  return (
    <group>
      {/* Cielorrazo principal */}
      <mesh position={[0, CIELINGHEIGHT, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <planeGeometry args={[50, 50]} />
        <meshLambertMaterial color="#f8d8ea" />
      </mesh>
      
      {/* Franjas de luz rectangulares */}
      {Array.from({ length: SPACING }, (_, i) => (
        <group key={i}>
          {/* Franjas horizontales */}
          <mesh position={[0.5, CIELINGHEIGHT - 0.05, (i - 2) * SPACING - 3.5 ]} rotation={[Math.PI / 2, 0, 0]}>
            <planeGeometry args={[40, 0.5]} />
            <meshBasicMaterial color="#ffffff" />
          </mesh>
          {/* Franjas verticales */}
          <mesh position={[(i - 2) * SPACING - 3.5, CIELINGHEIGHT - 0.05 , 0.5]} rotation={[Math.PI / 2, 0, Math.PI / 2]}>
            <planeGeometry args={[40.5, 0.5]} />
            <meshBasicMaterial color="#ffffff" />
          </mesh>
        </group>
      ))}
    </group>
  );
};

// Componente para las luces
const Lighting = () => {
  const startPos = -((7) / 2) * SPACING;
  return (
    <>
      <ambientLight intensity={0.2} />
      <directionalLight 
        position={[10, 10, 8]} 
        intensity={0.5} 
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
      />
      {/* Luces puntuales adicionales para simular las franjas del cielorrazo */}
      {Array.from({ length: SPACING }).map((_, i) => (
        Array.from({ length: SPACING }).map((_, j) => (
          <pointLight
            key={`${i}-${j}`}
            position={[
              startPos + i * SPACING,
              2.8,
              startPos + j * SPACING
            ]}
            intensity={2}
            color="#ebdf79"
            distance={SPACING}
          />
        ))
      ))}
    </>
  );
};

// Componente principal de la galería
const Gallery3DScene = () => {
  // Solución para el error de 'controlsRef.current'
  const controlsRef = useRef<any>(null);

  const [lookSpeed, setLookSpeed] = useState(0);

  // Manejador para el movimiento y la rotación del mouse
  useEffect(() => {
    const handlePointerEnter = () => {
      setLookSpeed(0.02); // Activa la rotación cuando el mouse entra
    };
    const handlePointerLeave = () => {
      setLookSpeed(0); // Desactiva la rotación cuando el mouse sale
    };

    const canvas = document.querySelector('canvas');
    if (canvas) {
      canvas.addEventListener('mouseenter', handlePointerEnter);
      canvas.addEventListener('mouseleave', handlePointerLeave);
    }

    return () => {
      if (canvas) {
        canvas.removeEventListener('mouseenter', handlePointerEnter);
        canvas.removeEventListener('mouseleave', handlePointerLeave);
      }
    };
  }, []);


  const keyboard = useRef<Record<string, boolean>>({});

  // Manejar el estado de las teclas presionadas
  useEffect(() => {
    const handleKeyDown = (e) => {
      keyboard.current[e.key.toLowerCase()] = true;
    };
    const handleKeyUp = (e) => {
      keyboard.current[e.key.toLowerCase()] = false;
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  // Bucle de renderizado para actualizar la rotación
  useFrame(() => {
    // Si la referencia existe, ejecuta el código
    if (controlsRef.current) {
      if (keyboard.current.q) {
        controlsRef.current.object.rotation.y += 0.03;
      }
      if (keyboard.current.e) {
        controlsRef.current.object.rotation.y -= 0.03;
      }
    }
  });

  const islandPositions: [number, number, number][] = [];
  
  for (let x = -15; x <= 15; x += SPACING) {
    for (let z = -15; z <= 15; z += SPACING) {
      islandPositions.push([x, ISLAND_HEIGHT / 2 , z]);
    }
  }

  return (
    <>
      <FirstPersonControls 
        ref={controlsRef}
        movementSpeed={2}
        lookSpeed={lookSpeed}
        lookVertical={true}
        constrainVertical={true}
        verticalMin={0.1}
        verticalMax={Math.PI - 0.1}
        heightMin={0.5}
        heightMax={2.5}
      />
      {/* Pared del fondo (Z negativa) */}
      <Wall
        position={[0, CIELINGHEIGHT / 2, -25]}
        rotation={[0, 0, 0]}
        texturePath = ""
        color = "#000"
      />
      {/* Pared del frente (Z positiva) */}
      <Wall
        position={[0, CIELINGHEIGHT / 2, 25]}
        rotation={[0, Math.PI, 0]} // Rotada 180 grados para que el lado visible mire hacia el interior
        texturePath = "/textures/brick_diffuse.jpg"
        color = "#000"
      />
      {/* Pared de la izquierda (X negativa) */}
      <Wall
        position={[-25, CIELINGHEIGHT / 2, 0]}
        rotation={[0, Math.PI / 2, 0]} // Rotada 90 grados
        texturePath = ""
        color = "#000"
      />
      {/* Pared de la derecha (X positiva) */}
      <Wall
        position={[25, CIELINGHEIGHT / 2, 0]}
        rotation={[0, -Math.PI / 2, 0]} // Rotada -90 grados
        texturePath = ""
        color = "#000"
      />

      <Garment position={[islandPositions[2][2] -1.5 , islandPositions[1][1] + 0.5 , islandPositions[2][2] +2 ]  } modelPath = '/designHardcoded/dress_plain2.glb'/>
      <Garment position={[islandPositions[2][2] , islandPositions[1][1] , islandPositions[2][2] +2 ] } modelPath = './designHardcoded/long_evening_dress.glb'/>
      
      
      
      
      <Lighting />
      <Floor />
      <Ceiling />
      
      {/* Renderizar todas las islas */}
      {islandPositions.map((position, index) => (
        <Island key={index} position={position} />
      ))}
      
      <Environment preset="warehouse" />
    </>
  );

};

// Componente wrapper exportable
interface Gallery3DProps {
  className?: string;
   patterns: string[];
}

const Gallery3D: React.FC<Gallery3DProps> = ({ className = "", patterns}) => {
  return (
    <div className={`w-full h-screen ${className}`}>
      <Canvas
        camera={{
          position: [0, 1.7, 10],
          fov: 75,
          near: 0.1,
          far: 1000
        }}
        shadows
        style={{ background: '#f5f5f5' }}
      >
        <Gallery3DScene />
      </Canvas>
      
    </div>
  );
};

export default Gallery3D;