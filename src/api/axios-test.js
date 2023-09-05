import axios from 'axios';
import { getToken, setAuthToken } from './user';

axios.defaults.baseURL = process.env.REACT_APP_TEST_URL;
setAuthToken(getToken());
const token = getToken();
if (token) {
    axios.defaults.headers.common.Authorization = `Bearer ${token}`;
} else {
    delete axios.defaults.headers.common.Authorization;
}

export default axios;
