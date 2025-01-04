import React from "react";

interface ButtonProps {
    label?: string;
    onClick?: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
    style?: string;
    type?: "submit" | "button" | "reset" | undefined;
}

export const Button: React.FC<ButtonProps> = ({ label, style, ...rest }) => {
    return (
        <button 
            className={`${style} text-white px-4 py-2 rounded-lg`}
            { ...rest }>
                {label}
        </button>
    )
}