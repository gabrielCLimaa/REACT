import { Button } from '../components/Button';
import { RoomCode } from '../components/RoomCode'
import { useHistory, useParams } from 'react-router-dom';
import { dataBase } from '../services/firebase';
import { FormEvent, useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { Question } from '../components/Question';
import { useRoom } from '../hooks/useRoom';
import  logoImg  from '../assets/images/logo.svg';
import '../styles/room.scss';

type RoomParams = {
	id: string;
}

export function Room() {
	const history = useHistory();
	const params = useParams<RoomParams>();
	const [ question, setQuestion ] = useState('');
	const { user, signInWithGoogle } = useAuth();
	const { questionsList , title, authorAvatar, authorName, authorNumberId } = useRoom(params.id);

	async function handleAuth() {
		if(!user) {
			 await signInWithGoogle();
		}
	}

	function handleAdminPage() {
		history.push(`/admin/rooms/${params.id}`);
	}

	async function handleSendQuestion(event: FormEvent) {
		event.preventDefault();
		if(question.trim() === '')
			return;

		if(!user)
			throw new Error("You must be logged in");

		const newQuestion = {
			content: question,
			author: {
				name: user.name,
				id: user.id,
				avatar: user.avatar
			},
			isHighlighted: false,
			isAnswered: false
		};
	
		await dataBase.ref(`rooms/${params.id}/questions`).push(newQuestion);

		setQuestion('');
	}

	async function handleLikedQuestion(questionId: string) {
	  await dataBase.ref(`rooms/${params.id}/questions/${questionId}/likes`).push({
			authorId: user?.id
		});
	}

	return ( 
		<div id="page-room">
			<header>
				<div className="content">
					<img src={logoImg} alt="letmeask"  />
					{user?.id  === authorNumberId ? (
						<div>
							 <button id="btn-admin" onClick={()=> handleAdminPage()}><strong>Admin Room</strong></button>
						</div>
					) : ('')}
					<RoomCode code={params.id} />
				</div>
			</header>
			<aside>
					<div id="side-box">
						<img src={authorAvatar} alt="avatat author"></img>
						<br></br>
						<p><strong>{authorName}</strong></p>
					</div>
				</aside>
			<main>
				<div className="room-title">
					<h1>{title}</h1>
					{ questionsList?.length ? <span>{questionsList.length} perguntas</span> : <span>{0} perguntas</span>}
				</div>

				<form onSubmit={handleSendQuestion}>
					<textarea placeholder="O que voce quer perguntar?" onChange={event => setQuestion(event.target.value)} value={question} />
				
					<div className="form-footer">
						{user ? (
							<div className="user-info">
								<img src={user.avatar} alt="Avatar"></img>
								<span>{user.name}</span> 
							</div>
						) : (
							<span>Para fazer uma pergunta ou dar um like, <button onClick={() => handleAuth()}>Faça seu login</button>.</span>
						)}
						<Button type="submit" disabled={!user}>Enviar pergunta </Button>
					</div>
				</form>
				{questionsList?.map(questionInList => {			
					return(
						<Question key={questionInList.id} content = {questionInList.content} authorName = {questionInList.author.name} 
						authorAvatar = {questionInList.author.avatar} isAnswered = {questionInList.isAnswered} isHighlighted = {	questionInList.isHighlighted}>
								{!questionInList.isAnswered && (
									<button className={`like-button ${questionInList.hasLiked ? 'liked' : ''}`} disabled={questionInList.hasLiked || !user} type="button" aria-label="Gostei" onClick={() => handleLikedQuestion(questionInList.id) }>
									{ questionInList.likesCount > 0 && <span>{ questionInList.likesCount }</span>}
									<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
										<path d="M7 22H4C3.46957 22 2.96086 21.7893 2.58579 21.4142C2.21071 21.0391 2 20.5304 2 20V13C2 12.4696 2.21071 11.9609 2.58579 11.5858C2.96086 11.2107 3.46957 11 4 11H7M14 9V5C14 4.20435 13.6839 3.44129 13.1213 2.87868C12.5587 2.31607 11.7956 2 11 2L7 11V22H18.28C18.7623 22.0055 19.2304 21.8364 19.5979 21.524C19.9654 21.2116 20.2077 20.7769 20.28 20.3L21.66 11.3C21.7035 11.0134 21.6842 10.7207 21.6033 10.4423C21.5225 10.1638 21.3821 9.90629 21.1919 9.68751C21.0016 9.46873 20.7661 9.29393 20.5016 9.17522C20.2371 9.0565 19.9499 8.99672 19.66 9H14Z" stroke="#737380" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
									</svg>									 
								</button>
								)}
						</Question>
					);
				})}
			</main>
		</div>
	);
}