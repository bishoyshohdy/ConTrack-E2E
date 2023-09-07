import { showerror } from '../helpers/toast-emitter';

let lastErrorTime = 0; // Initialize the last error time as 0 (epoch time in milliseconds)
const MIN_INTERVAL = 5 * 60 * 1000; // 5 minutes in milliseconds

export function globalErrorHandler(err) {
    const currentTime = Date.now();

    // Check if enough time has passed since the last error
    if (currentTime - lastErrorTime >= MIN_INTERVAL) {
        try {
            showerror(err.response.data.message);
            lastErrorTime = currentTime; // Update the last error time
        } catch (error) {
        showerror('API!! An Unkown error occured\nPlease check your internet connection');
    }
    return Promise.reject(err);
}
}
