import { ChangeEvent } from "react";

interface InputTextProps {
    style?: string;
    placeholder?: string;
    onChange?: (event: ChangeEvent<HTMLInputElement>) => void;
    id?: string;
    value?: string;
    type?: string;
}

export const InputText: React.FC<InputTextProps> = (props) => {
    const { style, type = "text", ...rest } = props;
    
    return (
        <input 
            type={type} 
            className={`${style} border px-3 py-2 rounded-lg text-gray-900`}
            {...rest}
        />
    )
}