import { toast } from 'react-toastify';

export function showsuccess (message) {
    toast.success(message, {
        closeOnClick: true
    });
}

export function showerror (message) {
    toast.error(message);
}

export function showinfo (message) {
    toast.info(message);
}
