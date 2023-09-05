import { showerror } from '../helpers/toast-emitter';

export function globalErrorHandler (err) {
    try {
        showerror(err.response.data.message);
    } catch (error) {
        showerror('An Unkown error occured\nPlease check your internet connection');
    }
    return Promise.reject(err);
}
