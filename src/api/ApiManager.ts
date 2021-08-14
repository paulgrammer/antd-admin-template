import Logger from '../utils/Logger'
import StorageHelper from '../utils/StorageHelper'
import HttpClient from './HttpClient'

export default class ApiManager {
    private static lastKnownPassword: string = ''
    private static lastKnownUsername: string = ''
    private static authToken = StorageHelper.getAuthKeyFromStorage() || ''

    private http: HttpClient

    constructor() {
        const self = this
        this.http = new HttpClient(this.getApiBaseUrl(), function () {
            if (!ApiManager.lastKnownPassword) {
                return Promise.reject(
                    new Error('No saved password. Ignore if initial call.')
                )
            }
            return self.getAuthToken(
                ApiManager.lastKnownUsername,
                ApiManager.lastKnownPassword
            )
        })
        this.http.setAuthToken(ApiManager.authToken)
    }

    getApiBaseUrl() {
        const URL = (process.env.REACT_APP_API_URL || '') + '/api/v1'
        Logger.dev(`API URL: ${URL}`)
        return URL
    }

    destroy() {
        this.http.destroy()
    }

    static getAuthTokenString() {
        return ApiManager.authToken
    }

    setAuthToken(authToken: string) {
        ApiManager.authToken = authToken
        if (!authToken) StorageHelper.clearAuthKeys()
        this.http.setAuthToken(authToken)
    }

    static isLoggedIn() {
        return !!ApiManager.authToken
    }

    getAuthToken(username: string, password: string) {
        const http = this.http
        ApiManager.lastKnownPassword = password
        ApiManager.lastKnownUsername = username

        const self = this
        return Promise.resolve() //
            .then(http.fetch(http.POST, '/auth/login', { password, username }))
            .then(function (data) {
                if (data.token) {
                    self.setAuthToken(data.token)
                    StorageHelper.setAdmin(data.isAdmin || false)
                } else {
                    return Promise.reject(data)
                }
            })
            .catch(function (error) {
                return Promise.reject(error)
            })
    }

    updatePathData(path: string, data: object) {
        const http = this.http
        return Promise.resolve() //
            .then(http.fetch(http.PATCH, path, data))
    }

    deletePathData(path: string, query: any) {
        const http = this.http
        return Promise.resolve() //
            .then(http.fetch(http.DELETE, path, query))
    }

    changePass(
        currentPassword: string,
        password: string,
        passwordConfirm: string
    ) {
        const http = this.http
        return Promise.resolve() //
            .then(
                http.fetch(http.PATCH, '/me/updatePassword', {
                    currentPassword,
                    password,
                    passwordConfirm,
                })
            )
    }

    postPathData(path: string, data: object) {
        const http = this.http
        return Promise.resolve() //
            .then(http.fetch(http.POST, path, data))
    }

    getPathData(path: string, query: any) {
        const http = this.http
        return Promise.resolve() //
            .then(http.fetch(http.GET, path, { ...query }))
    }
}
