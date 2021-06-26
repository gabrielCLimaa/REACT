import { Button } from '../components/Button';
import { RoomCode } from '../components/RoomCode'
import { useHistory, useParams } from 'react-router-dom';
import { Question } from '../components/Question';
import { useRoom } from '../hooks/useRoom';
import { dataBase } from '../services/firebase';
import  logoImg  from '../assets/images/logo.svg';
import deleteImg from '../assets/images/delete.svg';
import checkImg from '../assets/images/check.svg';
import answer from '../assets/images/answer.svg';
import '../styles/room.scss';
import { useAuth } from '../hooks/useAuth';

type RoomParams = {
	id: string;
}

export function AdminRoom() {
	const {user} = useAuth();
	const history = useHistory();
	const params = useParams<RoomParams>();
	const { questionsList, title, authorNumberId } = useRoom(params.id);

	async function handleCheckedQuestionAsAnswered(questionId: string) {
		await dataBase.ref(`rooms/${params.id}/questions/${questionId}`).update({
			isAnswered: true,
		});
	}

	async function handleHighlightInQuestion(questionId: string) {
		await dataBase.ref(`rooms/${params.id}/questions/${questionId}`).update({
			isHighlighted: true,
		});
	}

	async function handleCloseRoom() {
		await dataBase.ref(`rooms/${params.id}`).update({
			closedAt: new Date(),
		})
		history.push('/');
	}

	async function handleDeleteQuestion(questionId: string) {
	if(window.confirm("Tem certeza que deseja excluir esta pergunta?")) 
		await dataBase.ref(`rooms/${params.id}/questions/${questionId}`).remove(); 
	}

	return (  
		<div id="page-room">
			{user?.id === authorNumberId ? (
				<>
			<header>
				<div className="content">
					<img src={logoImg} alt="letmeask"  />
          <div>
            <RoomCode code={params.id} />
							<Button isOutlined onClick={() => handleCloseRoom()} >Encerrar sala</Button>
          </div>
				</div>
			</header>
			<main>
				<div className="room-title">
					<h1>{title}</h1>
					{ questionsList?.length ? <span>{questionsList.length} perguntas</span> : <span>{0} perguntas</span>}
				</div>

				{questionsList?.map(questionInList => {			
					return(
						<Question key={questionInList.id} content = {questionInList.content}
						 authorName = {questionInList.author.name} authorAvatar = {questionInList.author.avatar}
						 isAnswered = {questionInList.isAnswered} isHighlighted = {	questionInList.isHighlighted }>
							  {!questionInList.isAnswered && (
									<>
										<button type="button" onClick={() => handleCheckedQuestionAsAnswered(questionInList.id)}>
							 				<img src={checkImg} alt="Marcar pergunta como respondida"></img>
									 </button>
									  <button type="button" onClick={() => handleHighlightInQuestion(questionInList.id)}>
									 		<img src={answer} alt="Dar destaque a pergunta"></img>
									 </button>

									</>
								)}
							 <button type="button" onClick={() => handleDeleteQuestion(questionInList.id)}>
							 		<img src={deleteImg} alt="Remover pergunta"></img>
							 </button>
						</Question>
					);
				})}
			</main>
			</>
			) : ('Page for admin only')}
		</div>
	);
}