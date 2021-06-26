import "../styles/button.scss";
import { ButtonHTMLAttributes } from "react";

export function Button({isOutlined = false, ...props}: ButtonHTMLAttributes<HTMLButtonElement> & {isOutlined?: boolean}) {
  return (
    <button className={`button ${isOutlined ? 'outlined' : ''}`} {...props}/>
  )
}