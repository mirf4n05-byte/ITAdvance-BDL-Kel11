import api from './api'

//asumsi sementara
export const registerUser = (data) => {
    //data = {nama_lengkap, email, password}
    return api.post('/auth/register', data)

}

export const loginUser = (data) => {
    //data = {email, password}
    //response diasumsikan berisi {token: "..."}
    return api.post('/auth/login', data)
}