import type { AxiosRequestConfig, AxiosResponse, InternalAxiosRequestConfig } from 'axios'

export interface RequestInterceptors<T = any>{
    requestSuccessFn?: (config: InternalAxiosRequestConfig) => InternalAxiosRequestConfig | Promise<InternalAxiosRequestConfig>;
    requestFailureFn?: (error: any) => any;
    responseSuccessFn?: (response: AxiosResponse<T>) => AxiosResponse<T> | Promise<AxiosResponse<T>>;
    responseFailureFn?: (error: any) => any;
}

export interface HYRequestConfig<T = any> extends AxiosRequestConfig{
    interceptors?:RequestInterceptors<T>;
}