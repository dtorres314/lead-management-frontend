import axios from 'axios';
import Cookies from 'js-cookie';  // Import js-cookie for handling cookies

// Set base URL for API calls
const API_URL = 'http://localhost:8000';

// Set up Axios defaults for CSRF protection
axios.defaults.baseURL = API_URL;
axios.defaults.withCredentials = true;  // Ensure credentials (like cookies) are sent
axios.defaults.xsrfCookieName = 'XSRF-TOKEN';  // Default cookie name used by Laravel for CSRF
axios.defaults.xsrfHeaderName = 'X-XSRF-TOKEN';  // Header name Axios sends for CSRF token

// Fetch CSRF token before making requests that need CSRF protection
export const getCsrfToken = () => {
    return axios.get('/sanctum/csrf-cookie')
        .then((response) => {
            console.log('CSRF token fetched successfully:', response);
            return response;  // Return the response to continue the flow
        })
        .catch((error) => {
            console.error('Failed to fetch CSRF token:', error);
            throw error;  // Rethrow the error to handle it in the calling function
        });
};

// Register new user
export const register = async (data) => {
    await getCsrfToken();  // Ensure CSRF token is fetched before the register request
    const csrfToken = Cookies.get('XSRF-TOKEN');  // Get the CSRF token from the cookie

    return axios.post('/api/register', data, {
        headers: {
            'X-XSRF-TOKEN': csrfToken,  // Manually attach the CSRF token from the cookie
        },
        withCredentials: true,
    });
};

// Login user
export const login = async (data) => {
    await getCsrfToken();  // Ensure CSRF token is fetched before the login request
    const csrfToken = Cookies.get('XSRF-TOKEN');  // Get the CSRF token from the cookie

    return axios.post('/api/login', data, {
        headers: {
            'X-XSRF-TOKEN': csrfToken,  // Manually attach the CSRF token from the cookie
        },
        withCredentials: true,
    });
};

// Logout user
export const logout = () => {
    const token = localStorage.getItem('token');
    return axios.post('/api/logout', {}, {
        headers: {
            Authorization: `Bearer ${token}`,  // Attach Bearer token for authenticated requests
            'X-XSRF-TOKEN': Cookies.get('XSRF-TOKEN'),  // Manually attach the CSRF token
        },
        withCredentials: true,  // Ensure credentials (cookies, etc.) are sent
    });
};

// Get authenticated user data
export const getAuthenticatedUser = () => {
    const token = localStorage.getItem('token');
    return axios.get('/api/user', {
        headers: {
            Authorization: `Bearer ${token}`,  // Attach Bearer token for authenticated requests
            'X-XSRF-TOKEN': Cookies.get('XSRF-TOKEN'),  // Manually attach the CSRF token
        },
        withCredentials: true,  // Ensure credentials (cookies, etc.) are sent
    });
};

// Fetch Leads with Pagination, Search, Filter, and Sorting
export const fetchLeads = (page = 1, perPage = 10, search = '', status = '', sortBy = 'id', sortOrder = 'asc') => {
    const token = localStorage.getItem('token');
    return axios.get(`${API_URL}/api/leads?page=${page}&perPage=${perPage}&search=${search}&status=${status}&sortBy=${sortBy}&sortOrder=${sortOrder}`, {
        headers: {
            Authorization: `Bearer ${token}`,
            'X-XSRF-TOKEN': Cookies.get('XSRF-TOKEN'),
        },
        withCredentials: true,
    });
};

// Fetch Lead Statuses for filtering
export const fetchStatuses = () => {
    const token = localStorage.getItem('token');
    return axios.get(`${API_URL}/api/lead-statuses`, {
        headers: {
            Authorization: `Bearer ${token}`,
            'X-XSRF-TOKEN': Cookies.get('XSRF-TOKEN'),
        },
        withCredentials: true,
    });
};

// Add a new lead
export const addLead = (data) => {
    const token = localStorage.getItem('token');
    return axios.post(`${API_URL}/api/leads`, data, {
        headers: {
            Authorization: `Bearer ${token}`,
            'X-XSRF-TOKEN': Cookies.get('XSRF-TOKEN'),
        },
        withCredentials: true,
    });
};

// Update an existing lead
export const updateLead = (id, data) => {
    const token = localStorage.getItem('token');
    return axios.put(`${API_URL}/api/leads/${id}`, data, {
        headers: {
            Authorization: `Bearer ${token}`,
            'X-XSRF-TOKEN': Cookies.get('XSRF-TOKEN'),
        },
        withCredentials: true,
    });
};