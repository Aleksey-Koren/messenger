import axios from "axios";

console.log(document.location.host)
console.log(document.location.protocol)

export const axiosApi = axios.create({baseURL: `${document.location.protocol}//${document.location.hostname}:8080/`});

// export const axiosApi = document.location.host.indexOf('localhost') > -1 ?
//     axios.create({baseURL: 'http://localhost:8080'})
//     :
//     axios.create({baseURL: `${document.location.protocol}//${document.location.host}:8080/`});

// if (document.location.host.indexOf('localhost') > -1) {
//
//     axios.defaults.baseURL = 'http://localhost:8080/api'
// } else {
//     axios.create({baseURL: `${document.location.protocol}//${document.location.host}:8080/`});
//
//     axios.defaults.baseURL = document.location.protocol + '//' + document.location.host + '/api';
// }

console.log(`${document.location.protocol}//${document.location.hostname}:8080/`)
// export const axiosApi = axios.create({baseURL: 'http://46.101.136.62:8080/'});

axiosApi.interceptors.request.use(request => {
    // console.log('REQUEST INTERCEPTOR.' + request)

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