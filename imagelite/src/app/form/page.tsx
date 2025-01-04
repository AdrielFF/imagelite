'use client'

import { useState } from "react";
import { 
    Button, 
    InputText, 
    Template, 
    useNotification, 
    RenderIf, 
    FieldError,
    AuthenticatedPage
} from "@/components";
import { useImageService } from "@/resources";
import { useFormik } from "formik";
import Link from "next/link";
import { FormProps, formSchema, formValidationSchema } from "./formSchema";

export default function FormPage() {
    const [imagePreview, setImagePreview] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);

    const service = useImageService();
    const notification = useNotification();

    const formik = useFormik<FormProps>({
        initialValues: formSchema,
        onSubmit: handleSubmit,
        validationSchema: formValidationSchema
    });

    async function handleSubmit(data: FormProps) {
        setLoading(true);
        const formData = new FormData();
        formData.append("name", data.name);
        formData.append("tags", data.tags);
        formData.append("file", data.file);

        await service.save(formData);
        
        formik.resetForm();
        setImagePreview("");
        
        setLoading(false);

        notification.notify("Upload sent successfully", "success");
    }

    function handleFileUploadChange(event: React.ChangeEvent<HTMLInputElement>) {
        if(event.target.files) {
            const file = event.target.files[0];
            const url = URL.createObjectURL(file);
            formik.setFieldValue("file", file);
            setImagePreview(url);
        }
    }

    return (
        <AuthenticatedPage>
            <Template loading={loading}>
                <section className="flex flex-col items-center justify-center my-5">
                    <h5 className="mt-3 mb-10 text-3xl font-extrabold tracking-tight text-gray-900">New Image</h5>
                    <form onSubmit={formik.handleSubmit} className="w-full grid grid-cols-3 gap-4 max-w-lg mx-auto">
                        <div className="col-span-full">
                            <label className="block text-sm font-medium leading-6 text-gray-700">Name: *</label>
                            <InputText 
                                id="name" 
                                onChange={formik.handleChange} 
                                style="w-full"
                                value={formik.values.name}
                                placeholder="Type the image's name"/>
                            <FieldError error={formik.errors.name} />
                        </div>

                        <div className="col-span-full">
                            <label className="block text-sm font-medium leading-6 text-gray-700">Tags: *</label>
                            <InputText 
                                id="tags" 
                                onChange={formik.handleChange} 
                                style="w-full"
                                value={formik.values.tags}
                                placeholder="Type the tags comma separated"/>
                            <FieldError error={formik.errors.tags} />
                        </div>

                        <div className="col-span-full">
                            <label className="block text-sm font-medium leading-6 text-gray-700">Image: *</label>
                            <span className="text-red-500">
                            <FieldError error={formik.errors.file} />

                            </span>
                            <div className="mt-2 flex justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-10">
                                <div className="text-center">
                                    <RenderIf condition={!imagePreview}>
                                        <svg 
                                            className="mx-auto w-8 h-8 mb-4 text-gray-500 dark:text-gray-400" 
                                            aria-hidden="true" 
                                            xmlns="http://www.w3.org/2000/svg" 
                                            fill="none" 
                                            viewBox="0 0 20 16"
                                            >
                                            <path 
                                                stroke="currentColor" 
                                                strokeLinecap="round" 
                                                strokeLinejoin="round" 
                                                strokeWidth="2" 
                                                d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                                            />
                                        </svg>
                                    </RenderIf>
                                    <label className="relative cursor-pointer rounded-md bg-white font-semibold text-indigo-600">
                                        <RenderIf condition={!imagePreview}>
                                            <span>Click to upload</span>
                                        </RenderIf>
                                        <input onChange={handleFileUploadChange} type="file" className="sr-only" />
                                        <RenderIf condition={!!imagePreview}>
                                            <img src={imagePreview} />
                                        </RenderIf>
                                    </label>
                                </div>
                            </div>
                        </div>
                        <div className="col-span-full mt-4 flex justify-end gap-x-4">
                            <Button style="bg-blue-500 hover:bg-blue-300" type="submit" label="Save" />
                            <Link href="/gallery">
                                <Button style="bg-red-500 hover:bg-red-300" type="button" label="Cancel" />
                            </Link>
                        </div>
                    </form>
                </section>
            </Template>
        </AuthenticatedPage>
    )
}