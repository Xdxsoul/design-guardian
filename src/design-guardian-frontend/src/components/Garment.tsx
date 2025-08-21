import { useLoader } from '@react-three/fiber';
import { GLTFLoader } from 'three-stdlib';
import { useFrame } from '@react-three/fiber';
import { Object3D } from 'three';
import React, { useRef } from 'react';

export const Garment = ({ position, modelPath}: { position: [number, number, number], modelPath:  string }) => {
  const gltf = useLoader(GLTFLoader, modelPath);
 const ref = useRef<Object3D | null>(null);

  useFrame(() => {
    if (ref.current) {
      ref.current.rotation.y += 0.005;
    }
  });

  return (
    <primitive 
      ref={ref} 
      object={gltf.scene} 
      position={position} 
      scale={[1, 1, 1]} 
    />
  );
};