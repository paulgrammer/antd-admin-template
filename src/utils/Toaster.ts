import { message } from 'antd'

export default class Toaster {
    static toast(error: any) {
        let errorMessage = 'Something bad happened.'
        message.error(error.message || errorMessage)
    }

    static createCatcher(functionToRun?: Function) {
        return function (error: any) {
            Toaster.toast(error)
            if (functionToRun) {
                functionToRun()
            }
        }
    }
}
