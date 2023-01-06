import { FormEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

import illustrationImg from "../assets/image/illustration.svg";
// import logoImg from "../assets/image/logo.svg";
import bookImg from "../assets/image/e-book.png";

import { Button } from "../components/Button";
import { database } from "../services/firebase";
import { useAuth } from "../hooks/useAuth";

import "../styles/auth.scss";

export function NewRoom() {
  const { user } = useAuth()
  const navigate = useNavigate();

  //sempre começa um state com o valor do mesmo tipo que será salvo na variável
  const [newRoom, setNewRoom] = useState('')

  async function handleCreateRoom(event:FormEvent) {
    //desabilita o redirecionamento padrão, mas chamará a function
    event.preventDefault();

    //verificar se realmente existe um texto 
    //newroom: texto digitado pela pessoa
    //trim: removo os espaços tanto direita quando esquerda
    if (newRoom.trim() === ''){
      return;
    }

    const roomRef = database.ref('rooms')

    const firebaseRoom = await roomRef.push({
      title: newRoom,
      authorId: user?.id,
    })

    navigate(`/rooms/${firebaseRoom.key}`);
  }
  
  return (
    <div id="page-auth">
      <aside>
        <img
          src={illustrationImg}
          alt="Ilustração simbolizando perguntas e respostas"
        />
        <strong>Crie salas de Q&amp;A ao-vivo</strong>
        <p>Tire as dúvidas da sua audiência em tempo-real</p>
      </aside>

      <main>
        <div className="main-content">
          <img src={bookImg} alt="letmeask" />
          {/* <h1>{user?.name}</h1> */}
          <h2>Criar uma nova sala</h2>
          <form onSubmit={handleCreateRoom}>
            <input 
              type="text" 
              placeholder="Escolha um nome para a sala" 
              //Toda vez que o user digitar algo eu pego o evento
              onChange={event => setNewRoom(event.target.value)}
              value={newRoom}
            />
            <Button 
              type="submit">
              Criar salas
            </Button>
          </form>
          <p>
            Quer entrar em uma sala existente?
            <Link to="/">
                Clique aqui
            </Link>
          </p>
        </div>
      </main>
    </div>
  );
}
