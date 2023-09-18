import React, { useState } from "react";
import * as THREE from "three";
import { ContactShadows, Environment, OrbitControls, useCursor } from "@react-three/drei";
import { AnimatedWoman } from "./AnimatedWoman";
import { SocketManager, charactersAtom, socket } from "./SocketManager";
import { useAtom } from "jotai";

export const Experience = () => {
  const [_characters] = useAtom(charactersAtom);
  const [onFloor, setOnFloor] = useState(false);
  useCursor(onFloor)

  console.log(_characters);

  return (
    <>
      <SocketManager />
      <Environment preset="sunset" />
      <ambientLight intensity={0.2} />
      <ContactShadows blur={3} />
      <OrbitControls />
      <mesh
        rotation-x={-Math.PI / 2}
        position-y={-0.001}
        onClick={(e) => socket.emit("move", [e.point.x, 0, (e.point.z)])}
        onPointerEnter={() => setOnFloor(true)}
        onPointerLeave={() => setOnFloor(false)}
      >
        <planeGeometry args={[20, 20]} />
        <meshStandardMaterial color="#f0f0f0" />
      </mesh>
      {_characters.length > 0
        ? _characters.map((character) => (
            <AnimatedWoman
              key={character.id}
              hairColor={character.hairColor}
              position={
                new THREE.Vector3(
                  character.position[0],
                  character.position[1],
                  character.position[2]
                )
              }
              topColor={character.topColor}
              bottomColor={character.bottomColor}
            />
          ))
        : null}
    </>
  );
};
