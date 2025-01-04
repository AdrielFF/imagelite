import { AccessToken, Credentials, User, UserSessionToken } from './user.resources';
import { jwtDecode } from "jwt-decode";

class AuthService {
    baseUrl: string = `${process.env.NEXT_PUBLIC_API_URL}/v1/users`;
    static AUTH_PARAM: string = "_auth";

    async authenticate(credentials: Credentials): Promise<AccessToken> {
        const response = await fetch(`${this.baseUrl}/auth`, {
            method: "POST",
            body: JSON.stringify(credentials),
            headers: {
                "Content-Type": "application/json"
            }
        })

        if(response.status === 401) {
            throw new Error("User or password are incorrect!");
        }

        return await response.json();
    }

    async save(user: User): Promise<void> {
        const response = await fetch(`${this.baseUrl}`, {
            method: "POST",
            body: JSON.stringify(user),
            headers: {
                'Content-Type': 'application/json'
            }
        })

        if(response.status === 409) {
            const responseError = await response.json();
            throw new Error(responseError.error);
        }
    }

    initSession(token: AccessToken): void {
        if(token.accessToken) {
            const decodedToken: any = jwtDecode(token.accessToken);

            const userSession: UserSessionToken = {
                accessToken: token.accessToken,
                email: decodedToken.sub,
                name: decodedToken.name,
                expiration: decodedToken.exp
            }

            this.setUserSession(userSession)
        }
    }

    setUserSession(userSession: UserSessionToken) {
        try {
            localStorage.setItem(AuthService.AUTH_PARAM, JSON.stringify(userSession))
            
        } catch (error) {}
    }

    getUserSession(): UserSessionToken | null {
        try {
            const tokenString = localStorage.getItem(AuthService.AUTH_PARAM);
    
            if(!tokenString) {
                return null;
            }
    
            const token: UserSessionToken = JSON.parse(tokenString);
            return token;
        } catch(error) {
            return null;
        }
    }

    isTokenValid(): boolean {
        const token: UserSessionToken | null = this.getUserSession();

        if(!token) {
            return false;
        }

        const expiration = token.expiration;
        if(expiration) {
            const expirationDateInMilli = expiration * 1000;
            return new Date() < new Date(expirationDateInMilli);
        }

        return false;
    }

    invalidateSession(): void {
        try {
            localStorage.removeItem(AuthService.AUTH_PARAM);
        } catch(error){}
    }
}

export const useAuth = () => new AuthService();