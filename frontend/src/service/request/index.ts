import axios from 'axios'
import type {AxiosInstance} from 'axios'
import type {HYRequestConfig} from './type'

/**
 * 1.拦截器惊细控制
 * 2.响应结果类型处理（泛型）
 */
class HYRequest{
    instance:AxiosInstance;

    //request实例 => axios的实例
    constructor(config:HYRequestConfig){
        this.instance = axios.create(config);

        this.instance.interceptors.request.use(
            (config) => {
                return config;
            },
            (error) => {
                return error;
            }
        )
        this.instance.interceptors.response.use(
            (res) => {
                return res.data;
            },
            (error) => {
                return error;
            }
        )

        this.instance.interceptors.request.use(
            config.interceptors?.requestSuccessFn,
            config.interceptors?.requestFailureFn
        )
        this.instance.interceptors.response.use(
            config.interceptors?.responseSuccessFn,
            config.interceptors?.responseFailureFn
        )
    }

    //封装网络请求的方法
    request<T = any>(config:HYRequestConfig<T>){
        //返回Promise对象
        return new Promise<T>((resolve,reject)=>{
            this.instance.request<any,T>(config).then(res=>{
                resolve(res);
            }).catch(err=>{
                if(config.interceptors?.responseFailureFn){
                    err = config.interceptors.responseFailureFn(err);
                }
                reject(err);
            })
        })
    }

    get<T = any>(config:HYRequestConfig<T>){
        return this.request({...config,method:'GET'});
    }
    post<T = any>(config:HYRequestConfig<T>){
        return this.request({...config,method:'POST'});
    }
    delete<T = any>(config:HYRequestConfig<T>){
        return this.request({...config,method:'DELETE'});
    }
    patch<T = any>(config:HYRequestConfig<T>){
        return this.request({...config,method:'PATCH'});
    }

}

export default HYRequest;