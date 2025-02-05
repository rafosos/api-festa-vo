import axios, { AxiosRequestConfig } from "axios";
import { useToast } from "react-native-toast-notifications";

const API_URL = process.env.EXPO_PUBLIC_ENV == "dev" ? process.env.EXPO_PUBLIC_DEV_URL : process.env.EXPO_PUBLIC_PROD_URL

export const axiosInstance = axios.create({
    baseURL: API_URL,
    paramsSerializer: {
        indexes: null
    }
});

const get = <T extends unknown>(endpoint: string, params: any = {}) => 
    axiosInstance.get<T>(endpoint, {params});

const post = <T extends unknown>(endpoint: string, params: any = {}, config: AxiosRequestConfig<any> = {}) => 
    axiosInstance.post<T>(API_URL + endpoint, params, config);

const put = <T extends unknown>(endpoint: string, params: any = {}, config: AxiosRequestConfig<any> = {}) => 
    axiosInstance.put<T>(API_URL + endpoint, params, config);

const deletar = <T extends unknown>(endpoint: string, params: any = {}) => 
    axiosInstance.delete<T>(API_URL + endpoint, {params});

const patch = <T extends unknown>(endpoint: string, params: any = {}) => 
    axiosInstance.patch<T>(API_URL + endpoint, params);


const errorHandler = (error: any, message?: string) => {
    const toast = useToast();
    toast.show(message ?? error.message, {type: "error"});
    console.log(error)
}


export {get, post, put, deletar, errorHandler, patch}