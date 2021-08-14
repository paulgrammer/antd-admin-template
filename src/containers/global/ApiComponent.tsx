import { message } from 'antd'
import { Component } from 'react'
import ApiManager from '../../api/ApiManager'
import Toaster from '../../utils/Toaster'
export default class ApiComponent<P = {}, S = {}> extends Component<P, S> {
    protected willUnmountSoon: boolean
    protected apiManager: ApiManager

    constructor(props: any) {
        super(props)
        this.willUnmountSoon = false
        this.apiManager = new ApiManager()
    }

    componentWillUnmount() {
        this.willUnmountSoon = true
        this.apiManager.destroy()
    }

    deletePathData(opts: any) {
        return new Promise((resolve) => {
            this.apiManager
                .deletePathData(opts.path, opts.query)
                .then((record: any) => {
                    resolve(record)
                })
                .catch((err) => {
                    message.error(err.message)
                })
        })
    }

    updatePathData(opts: any) {
        return new Promise((resolve, reject) => {
            this.apiManager
                .updatePathData(opts.path, opts.data)
                .then(function (data: any) {
                    resolve(data)
                })
                .catch((err) => {
                    message.error(err.message)
                    reject(err)
                })
        })
    }

    postPathData(opts: any) {
        return new Promise((resolve, reject) => {
            this.apiManager
                .postPathData(opts.path, opts.data)
                .then((data: any) => {
                    resolve(data)
                })
                .catch((err) => {
                    message.error(err.message)
                    reject(err)
                })
        })
    }

    getPathData(opts: any) {
        return new Promise((resolve, reject) => {
            this.apiManager
                .getPathData(opts.path, opts.query)
                .then(function (data: any) {
                    resolve(data)
                })
                .catch(Toaster.createCatcher())
                .then(reject)
        })
    }
}
