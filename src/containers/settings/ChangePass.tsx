import { Button, Form, Input, message, Row } from 'antd'
import React from 'react'
import ApiComponent from '../global/ApiComponent'
import CenteredSpinner from '../global/CenteredSpinner'

export default class ChangePass extends ApiComponent<
    {
        isMobile: boolean
    },
    { isLoading: boolean; old: string; new1: string; new2: string }
> {
    constructor(props: any) {
        super(props)
        this.state = {
            isLoading: false,
            old: '',
            new1: '',
            new2: '',
        }
    }

    onChangePasswordClicked() {
        this.setState({ isLoading: true }, () => {
            this.apiManager
                .changePass(this.state.old, this.state.new1, this.state.new2)
                .then((res) => {
                    message.success('Password changed successfully!')
                    this.setState({ isLoading: false })
                })
                .catch((e) => {
                    message.error(e.message)
                    this.setState({ isLoading: false })
                })
        })
    }

    render() {
        if (this.state.isLoading) {
            return <CenteredSpinner />
        }

        return (
            <Form layout="vertical">
                <Form.Item label="OLD PASSWORD">
                    <Input.Password
                        size="large"
                        onChange={(e) => this.setState({ old: e.target.value })}
                    />
                </Form.Item>
                <Form.Item label="NEW PASSWORD">
                    <Input.Password
                        size="large"
                        onChange={(e) =>
                            this.setState({ new1: e.target.value })
                        }
                    />
                </Form.Item>
                <Form.Item label="CONFIRM NEW PASSWORD">
                    <Input.Password
                        size="large"
                        onChange={(e) =>
                            this.setState({ new2: e.target.value })
                        }
                    />
                </Form.Item>
                <Row justify="end">
                    <Button
                        block={this.props.isMobile}
                        onClick={() => this.onChangePasswordClicked()}
                        type="primary"
                    >
                        CHANGE
                    </Button>
                </Row>
            </Form>
        )
    }
}
