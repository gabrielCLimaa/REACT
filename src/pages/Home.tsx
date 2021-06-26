import { useHistory } from 'react-router';
import illustrationImage from '../assets/images/illustration.svg';
import logoImage from '../assets/images/logo.svg';
import googleIconImage from '../assets/images/google-icon.svg';
import  { useAuth } from '../hooks/useAuth';
import { Button } from '../components/Button';
import { FormEvent } from 'react';
import { useState } from 'react';
import { dataBase } from '../services/firebase';
import '../styles/auth.scss';

export function Home() {
  const history = useHistory();
  const { user , signInWithGoogle } = useAuth();
  const [roomCode, setRoomCode] = useState('');
  
   async function handleCreateRoom() {
    if(!user) {
     await signInWithGoogle();
    }
    history.push('rooms/new')
  };

  async function handleJoinRoom(event: FormEvent) {
    event.preventDefault();
    if(roomCode.trim() === '') 
      return;
    const roomReference = await dataBase.ref(`/rooms/${roomCode}`).get();
    if(!roomReference.exists()){
      alert("Room does not exists");
      return;
    }

    if(roomReference.val().closedAt) {
      alert("Room already closed");
      return;
    }

    history.push(`/rooms/${roomCode}`);
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
          <button className="create-room" onClick={handleCreateRoom}>
            <img src={googleIconImage} alt="Logo google"></img>
            Crie sua sala com Google
          </button>
          <div className="separator">ou entre em uma sala</div>
          <form onSubmit={handleJoinRoom}>
            <input type="text" placeholder="Digite o codigo da sala" 
            onChange={event => setRoomCode(event.target.value)} value={roomCode} />
            <Button type="submit">
               Entrar na sala
            </Button>
          </form>
        </div>
      </main>
    </div>
  )
}
