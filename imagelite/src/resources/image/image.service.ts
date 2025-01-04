import { useAuth } from "../user/authentication.service";
import { Image } from "./image.resource";

class ImageService {
    baseUrl: string = `${process.env.NEXT_PUBLIC_API_URL}/v1/images`;
    auth = useAuth();

    async search(query: string = "", extension: string = ""): Promise<Image[]> {
        const url =`${this.baseUrl}?query=${query}&extension=${extension}`;
        const token = this.getToken();

        const response = await fetch(url, {
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });
        return await response.json();
    }

    async save(data: FormData): Promise<string> {
        const token = this.getToken();
        const response = await fetch(this.baseUrl, {
            method: 'POST',
            body: data,
            headers: {
                "Authorization": `Bearer ${token}`
            }
        })

        return response.headers.get("location") ?? '';
    }

    private getToken() {
        return this.auth.getUserSession()?.accessToken;
    }
}

export const useImageService = () => new ImageService();