import { LockOutlined, UserOutlined } from '@ant-design/icons'
import { Button, Card, Collapse, Input, message, Radio, Row } from 'antd'
import React from 'react'
import { Redirect, RouteComponentProps } from 'react-router'
import ApiManager from '../api/ApiManager'
import StorageHelper from '../utils/StorageHelper'
import Utils from '../utils/Utils'
import ApiComponent from './global/ApiComponent'

const NO_SESSION = 1
const SESSION_STORAGE = 2
const LOCAL_STORAGE = 3

export default class Login extends ApiComponent<RouteComponentProps<any>, any> {
    constructor(props: any) {
        super(props)
        this.state = {
            loginOption: NO_SESSION,
        }
    }

    componentDidMount() {
        if (super.componentDidMount) super.componentDidMount()

        Utils.deleteAllCookies()
    }

    onLoginRequested(username: string, password: string, callback: Function) {
        const self = this
        this.apiManager
            .getAuthToken(username, password)
            .then(function () {
                if (self.state.loginOption === SESSION_STORAGE) {
                    StorageHelper.setAuthKeyInSessionStorage(
                        ApiManager.getAuthTokenString()
                    )
                } else if (self.state.loginOption === LOCAL_STORAGE) {
                    StorageHelper.setAuthKeyInLocalStorage(
                        ApiManager.getAuthTokenString()
                    )
                }
                self.props.history.push('/')
                callback()
            })
            .catch((e) => {
                callback()
                message.error(e.message)
            })
    }

    render() {
        const self = this

        if (ApiManager.isLoggedIn()) return <Redirect to="/" />

        return (
            <div>
                <div
                    style={{
                        position: 'absolute',
                        left: '50%',
                        top: '50%',
                        transform: 'translate(-50%,-50%)',
                    }}
                >
                    <Card title="Log in" style={{ width: 350 }}>
                        <NormalLoginForm
                            onLoginRequested={(
                                username: string,
                                password: string,
                                loginOption: number,
                                callback: Function
                            ) => {
                                self.setState({ loginOption })
                                self.onLoginRequested(
                                    username,
                                    password,
                                    callback
                                )
                            }}
                        />
                    </Card>
                </div>
            </div>
        )
    }
}

const radioStyle = {
    display: 'block',
    height: '30px',
    lineHeight: '30px',
}

class NormalLoginForm extends React.Component<
    any,
    {
        loginOption: number
        passwordEntered: string
        username: string
        loading: boolean
    }
> {
    constructor(props: any) {
        super(props)
        this.state = {
            loginOption: SESSION_STORAGE,
            passwordEntered: ``,
            username: ``,
            loading: false,
        }
    }

    handleSubmit = () => {
        this.setState({ loading: true }, () => {
            this.props.onLoginRequested(
                this.state.username,
                this.state.passwordEntered,
                this.state.loginOption,
                () =>
                    setTimeout(() => {
                        this.setState({ loading: false })
                    }, 500)
            )
        })
    }

    render() {
        const self = this
        return (
            <div>
                <Input
                    style={{ marginBottom: 20 }}
                    size="large"
                    prefix={
                        <UserOutlined style={{ color: 'rgba(0,0,0,.25)' }} />
                    }
                    onChange={(e) => {
                        self.setState({ username: `${e.target.value}` })
                    }}
                    placeholder="Username"
                />
                <Input.Password
                    size="large"
                    onKeyDown={(key) => {
                        if (key.keyCode === 13) {
                            self.handleSubmit()
                        }
                    }}
                    prefix={
                        <LockOutlined style={{ color: 'rgba(0,0,0,.25)' }} />
                    }
                    onChange={(e) => {
                        self.setState({ passwordEntered: `${e.target.value}` })
                    }}
                    placeholder="Password"
                />
                <div style={{ marginTop: 20, marginBottom: 20 }}>
                    <Row justify="end">
                        <Button
                            type="primary"
                            htmlType="submit"
                            loading={self.state.loading}
                            onClick={() => {
                                self.handleSubmit()
                            }}
                        >
                            {self.state.loading ? 'Please wait...' : 'Login'}
                        </Button>
                    </Row>
                </div>
                <Collapse>
                    <Collapse.Panel header="Remember Me" key="1">
                        <Radio.Group
                            onChange={(e) => {
                                self.setState({
                                    loginOption: e.target.value,
                                })
                            }}
                            value={self.state.loginOption}
                        >
                            <Radio style={radioStyle} value={NO_SESSION}>
                                No session persistence
                            </Radio>
                            <Radio style={radioStyle} value={SESSION_STORAGE}>
                                Use sessionStorage
                            </Radio>
                            <Radio style={radioStyle} value={LOCAL_STORAGE}>
                                Use localStorage
                            </Radio>
                        </Radio.Group>
                    </Collapse.Panel>
                </Collapse>
            </div>
        )
    }
}
