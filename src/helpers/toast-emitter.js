import { toast } from 'react-toastify';

export function showsuccess (message) {
    toast.success(message, {
        closeOnClick: true
    });
}

let lastErrorTimestamp=0;

export function showerror (message) {
    const currentTime= Date.now();
    if (currentTime - lastErrorTimestamp>= 1*5*60){
    toast.error(message, {
        position: "bottom-right",
        autoClose: false,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
        });
        lastErrorTimestamp=currentTime;
    }
}

export function showinfo (message) {
    toast.info(message);
}
