import { useState, useEffect } from 'react';
import { dataBase } from '../services/firebase';
import { useAuth } from '../hooks/useAuth';

type Questions = {
	id: string,
	content: string,
	author: {
		name: string,
		id: string,
		avatar: string
	},
	isHighlighted: boolean,
	isAnswered: boolean,
	likesCount: number,
	hasLiked: boolean;
}

type FireBaseQuestions = Record<string,{
	author: {
		name: string,
		id: string,
		avatar: string
	},
	content: string,
	isHighlighted: boolean,
	isAnswered: boolean,
	likes: Record<string, {
		authorId: string
	}>,
	hasLiked: boolean;
}>


export function useRoom(IdRoom: string) {
	const { user } = useAuth();
  const [ questionsList, setQuestionsList] = useState<Questions[]>();
	const [ title, setTitle ] = useState('');
	const [ authorName, setAuthorName ] = useState('');
	const [ authorAvatar, setAuthorAvatar ] = useState('');
	const [ authorNumberId, setAuthorNumberId ] = useState('');
  
  useEffect(() => {
		const roomReference = dataBase.ref(`rooms/${IdRoom}`);
		roomReference.on('value', room => {
			const dataBaseRoom = room.val();
			const fireBaseQuestions: FireBaseQuestions = dataBaseRoom.questions ?? {};
			const parsedQuestions = Object.entries(fireBaseQuestions).map(([key, values]) => {
				return {
					id: key,
					content: values.content,
					author: {
						name: values.author.name,
						id: values.author.id,
						avatar: values.author.avatar,
					},
					isHighlighted: values.isHighlighted,
					isAnswered: values.isAnswered,
					likesCount: Object.values(values.likes ?? {}).length,
					hasLiked: Object.values(values.likes ?? {}).some(like=> like.authorId === user?.id)
				}
			})
			setAuthorNumberId(dataBaseRoom.authorId);
			setAuthorAvatar(dataBaseRoom.authorAvatar);
			setAuthorName(dataBaseRoom.authorName);
			setTitle(dataBaseRoom.title);
			setQuestionsList(parsedQuestions);
		});
		return () => {
			roomReference.off('value');
  	}
	}, [IdRoom, user?.id]);
  return { questionsList, title, authorAvatar, authorName, authorNumberId }
}