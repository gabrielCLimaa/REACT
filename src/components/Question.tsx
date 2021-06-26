import '../styles/question.scss';
import { ReactNode } from 'react';

type QuestionProps = {
  content: string;
  authorName: string;
  authorAvatar: string;
  children?: ReactNode;
  isAnswered?: boolean;
  isHighlighted?: boolean;
}

export function Question({ content,  authorName, authorAvatar, children, isAnswered = false, isHighlighted = false } :QuestionProps) {
  return(
    <div className={`question ${isAnswered ? 'answered' : ''} ${isHighlighted ? 'highlighted' : ''}`} >
      <p> <strong>{content}</strong></p>
      <footer>
        <div className="user-info">
          <img src={authorAvatar} alt="avatar"></img>
          <span> {authorName } </span>
        </div>
        <div> { children } </div>
      </footer>
    </div>
  );
}