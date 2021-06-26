import { Link, useHistory } from 'react-router-dom';
import illustrationImage from '../assets/images/illustration.svg';
import logoImage from '../assets/images/logo.svg';
import { Button } from "../components/Button"; 
import { useAuth} from '../hooks/useAuth';
import { FormEvent, useState } from 'react';
import { dataBase } from '../services/firebase'; 
import "../styles/auth.scss";

export function NewRoom() {
  const {user} = useAuth();
  const [newRoom, setNewRoom] = useState('');
  const history = useHistory();

  async function handleCreateRoom(event: FormEvent) {
    event.preventDefault();
    if(newRoom.trim() === '') {
      return;
    }

    const roomId = dataBase.ref('rooms');
    console.log(roomId)
    const fireBaseRoom = await roomId.push({
      title: newRoom,
      authorId: user?.id,
      authorName: user?.name,
      authorAvatar: user?.avatar
    });
    history.push(`/rooms/${fireBaseRoom.key}`);
  }

  return (
    <div id="page-auth">
      <aside> 
        <img src={illustrationImage} alt="Ilustração simbolizando perguntas e respostas" />
        <strong>Crie salas de Q&amp;A ao-vivo</strong>
        <p>Tire suas duvidas em tempo real</p>
      </aside>
      <main>
        <div className="main-content">
          <img src={logoImage} alt="LetmeASK"></img>
          <h1>{user?.name }</h1>
          <h2>Cria uma nova sala</h2>
          <form onSubmit={handleCreateRoom}>
            <input type="text" placeholder="Nome da sala" onChange={event => setNewRoom(event.target.value)} value={newRoom} />
            <Button type="submit">
               Criar sala
            </Button>
          </form>
          <p>Quer entrar em uma nova sala? <Link to="/">Clique aqui</Link></p>
        </div>
      </main>
    </div>
  )
}