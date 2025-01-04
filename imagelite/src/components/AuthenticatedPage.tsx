'use client';

import { useAuth } from "@/resources";
import { useRouter } from "next/navigation";
import React, { ReactNode, useEffect, useState } from "react";
import { DefaultLoadingScreen } from "./Template";

interface AuthenticatedPageProps {
    children?: ReactNode
}

export const AuthenticatedPage: React.FC<AuthenticatedPageProps> = ({ children }) => {
    const auth = useAuth();
    const router = useRouter();
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

    useEffect(() => {
        if(!auth.isTokenValid()) {
            router.push("/login")
        } else {
            setIsAuthenticated(true)
            if (!children)
                router.push("/gallery")
        }
    }, [auth, router])

    if(!isAuthenticated) {
        return <DefaultLoadingScreen />
    }

    return (
        <>
            { children }
        </>
    )
}