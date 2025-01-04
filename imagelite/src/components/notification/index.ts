import { toast } from "react-toastify"

type notificationType = "default" | "error" | "info" | "success" | "warning";

export const useNotification = () => {
    const notify = (message: string, type: notificationType) => {
        toast(message, {
            type
        })
    }

    return {
        notify
    }
}