import { useEffect } from "react"
import { io } from "socket.io-client"
import { useAtom, atom } from "jotai"

export const socket = io("http://localhost:3001")
export const charactersAtom = atom([])

export const SocketManager = () => {
  const [_characters, setCharacters] = useAtom(charactersAtom)

  useEffect(() => {
    function onConnect() {
      console.log("Connectado");
    }

    function onDisconnect() {
      console.log("Desconectado");
    }

    function onMessage() {
      console.log("Messagem");
    }

    function onCharacters(value) {
      setCharacters(value)
    }

    socket.on("characters", onCharacters);
    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);
    socket.on("message", onMessage);

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
      socket.off("message", onMessage);
      socket.off("characters", onCharacters);
    }
  })
}