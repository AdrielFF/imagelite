import * as Yup from "yup";

export interface LoginForm {
    name: string;
    email: string;
    password: string;
    confirmPassword: string;
}

export const validationSchema = Yup.object().shape({
    email: Yup.string().required("Email is required!").email("Invalid email format!"),
    password: Yup.string().required("Password is required").min(8, "Password must have at least 8 characters!"),
    confirmPassword: Yup.string().oneOf([Yup.ref("password")], "Passwords must match!")
})


export const formSchema: LoginForm = {
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
}