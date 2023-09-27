import { useEffect } from "react"
import { io } from "socket.io-client"
import { useAtom, atom } from "jotai"

export const socket = io("http://localhost:3001")
export const charactersAtom = atom([])
export const mapAtom = atom(null)
export const userAtom = atom(null)

export const SocketManager = () => {
  const [_characters, setCharacters] = useAtom(charactersAtom)
  const [map, setMap] = useAtom(mapAtom)
  const [user, setUser] = useAtom(userAtom)

  useEffect(() => {
    function onConnect() {
      console.log("Connectado");
    }

    function onDisconnect() {
      console.log("Desconectado");
    }

    function onMessage(value) {
      setMap(value.map)
      setCharacters(value.characters)
      setUser(value.id)
    }

    function onPlayerMove(value) {
      setCharacters((prev) => {
        return prev.map(character => {
          if (character.id === value.id) {
            return value
          }
          return character
        })
      })
    }

    function onCharacters(value) {
      setCharacters(value)
    }

    socket.on("characters", onCharacters);
    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);
    socket.on("message", onMessage);
    socket.on("playerMove", onPlayerMove);

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
      socket.off("message", onMessage);
      socket.off("characters", onCharacters);
      socket.off("playerMove", onPlayerMove);
    }
  })
}