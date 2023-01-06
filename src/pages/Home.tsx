import { useNavigate } from "react-router-dom";
import { FormEvent, useState } from "react";

// import illustrationImg from "../assets/image/illustration.svg";
// import logoImg from "../assets/image/logo.svg";
import googleIconImg from "../assets/image/google-icon.svg";
import bookImg from "../assets/image/e-book.png";

import { database } from "../services/firebase";

import { Button } from "../components/Button";

import { useAuth } from "../hooks/useAuth";

import "../styles/auth.scss";


export function Home() {
  const navigate = useNavigate();
  const { user, signInWithGoogle} = useAuth()
  const [roomCode, setRoomCode] = useState('')

  async function handleCreateRooms(){
    if (!user){
      await signInWithGoogle()
    }

    navigate('/rooms/new');
  }

  async function handleJoinRoom(event: FormEvent) {
    event.preventDefault();

    if (roomCode.trim() === '') {
      return;
    }

    const roomRef = await database.ref(`rooms/${roomCode}`).get();

    if (!roomRef.exists()) {
      alert('Room does not exists.');
      return;
    }

    if (roomRef.val().endedAt) {
      alert('Room already closed.');
      return;
    }

    navigate(`/rooms/${roomCode}`);
  }

  return (
    <div id="page-auth">
      <aside>
        {/* <img
          src={illustrationImg}
          alt="Ilustração simbolizando perguntas e respostas"
        /> */}
        <strong>Crie salas de Q&amp;A ao-vivo</strong>
        <p>Tire as dúvidas sobre seus livros favoritos</p>
      </aside>

      <main>
        <div className="main-content">
          <img src={bookImg} alt="letmeask" />
          <button onClick={handleCreateRooms} className="create-room">
            <img src={googleIconImg} alt="logo do Google" />
            Crie sua sala com o Google
          </button>
          <div className="separator">ou entre em uma sala</div>
          <form onSubmit={handleJoinRoom}>
            <input 
              type="text" 
              placeholder="Digite o código da sala" 
              onChange={event => setRoomCode(event.target.value)}
              value={roomCode}
            />
            <Button 
              type="submit">
              Entrar na sala
            </Button>
          </form>
        </div>
      </main>
    </div>
  );
}
