import axios from "axios";

export const axiosApi = axios.create({baseURL: `${document.location.protocol}//${document.location.hostname}:8080/`});

axiosApi.interceptors.request.use(request => {
    return request;
}, (error) => {
    console.log('REQUEST ERROR');
})

axiosApi.interceptors.response.use(response => {
        // console.log('RESPONSE INTERCEPTOR. ' + response)
        return response;
    },
    (error) => {
        console.log('RESPONSE ERROR. ' + error)

        return Promise.reject(error);
    }
)