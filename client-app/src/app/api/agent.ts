/* eslint-disable no-prototype-builtins */
import axios, { type AxiosError, type AxiosResponse } from 'axios'
import { toast } from 'react-toastify'
import { type Activity } from '../models/activity'
import { router } from '../router/Routes'
import { store } from '../strores/store'

const sleep = async (delay: number) => {
  return await new Promise((resolve) => {
    setTimeout(resolve, delay)
  })
}

axios.defaults.baseURL = 'http://localhost:5000/api'

axios.interceptors.response.use(
  async (response) => {
    await sleep(1000)
    return response
  },
  async (error: AxiosError) => {
    const { data, status, config } = error.response as AxiosResponse
    switch (status) {
      case 400:
        if (config.method === 'get' && data.errors.hasOwnProperty('id')) {
          router.navigate('/not-found')
        }
        if (data.errors) {
          const modelStateErrors = []
          for (const key in data.errors) {
            if (data.errors[key]) {
              modelStateErrors.push(data.errors[key])
            }
          }
          throw modelStateErrors.flat()
        } else {
          toast.error(data)
        }
        break
      case 401:
        toast.error('Unautorized')
        break
      case 403:
        toast.error('Forbidden')
        break
      case 404:
        router.navigate('/not-found')
        break
      case 500:
        store.commonStore.setServerError(data)
        router.navigate('/server-error')
        break
      default:
        break
    }
    return await Promise.reject(error)
  }
)

const responseBody = <T>(response: AxiosResponse<T>) => response.data

const requests = {
  get: async <T>(url: string) => await axios.get<T>(url).then(responseBody),
  post: async <T>(url: string, body: unknown) =>
    await axios.post<T>(url, body).then(responseBody),
  put: async <T>(url: string, body: unknown) => await axios.put<T>(url, body).then(responseBody),
  del: async <T>(url: string) => await axios.delete<T>(url).then(responseBody)
}

const Activities = {
  list: async () => await requests.get<Activity[]>('/activities'),
  details: async (id: string) => await requests.get<Activity>(`/activities/${id}`),
  create: async (activity: Activity) => await axios.post<void>('/activities', activity),
  update: async (activity: Activity) =>
    await axios.put<void>(`/activities/${activity.id}`, activity),
  delete: async (id: string) => await axios.delete<void>(`/activities/${id}`)
}

const agent = {
  Activities
}

export default agent
