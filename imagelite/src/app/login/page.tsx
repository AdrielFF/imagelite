'use client'

import { Button, FieldError, InputText, Template, useNotification } from "@/components";
import { useState } from "react";
import { RenderIf } from '../../components/Template';
import { useFormik } from "formik";
import { useAuth } from "@/resources";
import { Credentials, User } from "@/resources/user/user.resources";
import { formSchema, LoginForm, validationSchema } from "./formSchema";
import { AccessToken } from '../../resources/user/user.resources';
import { useRouter } from "next/navigation";


export default function Login() {
    const auth = useAuth();
    const notification = useNotification();
    const route = useRouter();

    const [loading, setLoading] = useState<boolean>(false);
    const [newUser, setNewUser] = useState<boolean>(false);

    const { handleSubmit, values, errors, handleChange, resetForm } = useFormik<LoginForm>({
        initialValues: formSchema,
        validationSchema: validationSchema,
        onSubmit: onSubmit
    });

    async function onSubmit({ email, name, password }: LoginForm) {
        if(!newUser) {
            try {
                const credentials: Credentials = { email, password };
                const accessToken: AccessToken = await auth.authenticate(credentials);
                auth.initSession(accessToken);
                route.push("/gallery");
            } catch(error: any) {
                notification.notify(error.message, "error");
            }
        } else {
            const user: User = { name, email, password  };
            try {
                await auth.save(user);
                notification.notify("User created successfully!", "success");
                resetForm();
                setNewUser(false);
            } catch(error: any) {
                notification.notify(error.message, "error");
            }
        }
    }

    return (
        <Template loading={loading}>
            <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
                <div className="sm:mx-auto sm:w-full sm:max-w-sm">
                    <h2 className="mt-10 text-center text-xl font-bold leading-9 tracking-tight text-gray-900">
                        {newUser ? 'Create an account' : 'Login to your account'}
                    </h2>
                </div>
                <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
                    <form className="space-y-4" onSubmit={handleSubmit}>
                        <RenderIf condition={newUser}>
                            <div>
                                <label className="block text-sm font-medium leading-6 text-gray-900">Name: </label>
                                <div className="mt-2">
                                <InputText 
                                    style="w-full"
                                    id="name"
                                    value={values.name}
                                    onChange={handleChange}/>
                                <FieldError error={errors.name} />
                            </div>
                            </div>
                        </RenderIf>

                        <div>
                            <label className="block text-sm font-medium leading-6 text-gray-900">Email: </label>
                            <InputText 
                                style="w-full"
                                id="email"
                                value={values.email}
                                onChange={handleChange}/>
                            <FieldError error={errors.email} />
                        </div>

                        <div>
                            <label className="block text-sm font-medium leading-6 text-gray-900">Password: </label>
                            <InputText 
                                style="w-full"
                                type="password"
                                id="password"
                                value={values.password}
                                onChange={handleChange}/>
                            <FieldError error={errors.password} />
                        </div>

                        <RenderIf condition={newUser}>
                            <div>
                                <label className="block text-sm font-medium leading-6 text-gray-900">Confirm password: </label>
                                <InputText 
                                    style="w-full"
                                    type="password"
                                    id="confirmPassword"
                                    value={values.confirmPassword}
                                    onChange={handleChange} />
                                <FieldError error={errors.confirmPassword} />
                            </div>
                        </RenderIf>
                        <div>
                            <RenderIf condition={newUser}>
                                <Button 
                                    type="submit"  
                                    style="bg-indigo-700 hover:bg-indigo-500"
                                    label="Save"/>
                                <Button 
                                    type="button" 
                                    style="bg-red-700 hover:bg-red-500 mx-2"
                                    label="Cancel"
                                    onClick={event => setNewUser(false)}/>
                            </RenderIf>
                            <RenderIf condition={!newUser}>
                                <Button 
                                    type="submit"  
                                    style="bg-indigo-700 hover:bg-indigo-500"
                                    label="Login"/>
                                <Button 
                                    type="button" 
                                    style="bg-red-700 hover:bg-red-500 mx-2"
                                    label="Sign up"
                                    onClick={event => setNewUser(true)}/>
                            </RenderIf>
                        </div>
                    </form>
                </div>
            </div>
        </Template>
    )
}