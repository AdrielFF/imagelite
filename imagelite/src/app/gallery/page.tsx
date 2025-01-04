'use client'

import { 
    Button,
    ImageCard,
    InputText,
    Template,
    useNotification,
    AuthenticatedPage
} from "@/components";
import { useImageService } from '../../resources/image/image.service';
import { useState } from "react";
import { Image } from "@/resources/image/image.resource";

import Link from "next/link";

export default function GalleryPage() {
    const service = useImageService();
    const notification = useNotification();
    
    const [images, setImages] = useState<Image[]>([]);
    const [extension, setExtension] = useState<string>("");
    const [query, setQuery] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false);

    async function searchImages() {
        setLoading(true);
        const result = await service.search(query, extension);
        setImages(result);
        setLoading(false);

        if(!result.length) {
            notification.notify("No results found!", "warning");
        }
    } 

    function renderImageCard(image: Image) {
        return (
        <ImageCard 
            key={image.url}
            name={image.name} 
            size={image.size}
            extension={image.extension} 
            uploadDate={image.uploadDate} 
            url={image.url}
            />
        )
    }

    function renderImageCards() {
        return images.map(renderImageCard);
    }

    return (
        <AuthenticatedPage>
            <Template loading={loading}>
                <section className="flex flex-col items-center justify-center my-5">
                    <div className="flex space-x-4">
                        <InputText 
                            placeholder="Type name or tags" 
                            onChange={(event) => setQuery(event.target.value)}
                        />
                    <select 
                        onChange={event => setExtension(event.target.value)} 
                        className="border px-4 py-2 rounded-lg text-gray-900"
                    >
                        <option value="">All formats</option>
                        <option value="PNG">PNG</option>
                        <option value="JPEG">JPEG</option>
                        <option value="GIF">GIF</option>
                    </select>
                    <Button type="button" label="Search" onClick={searchImages} style="bg-blue-500 hover:bg-blue-300" />
                    <Link href="/form">
                        <Button type="button" label="Add new" style="bg-yellow-500 hover:bg-yellow-300" />
                    </Link>
                    </div>
                </section>
                <section className="grid grid-cols-4 gap-8">
                    { renderImageCards() }
                </section>
            </Template>    
        </AuthenticatedPage>
    )
}