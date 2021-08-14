import { Button, Row } from 'antd'
import React, { Component } from 'react'

export default class ErrorRetry extends Component<any, {}> {
    render() {
        const self = this
        return (
            <div style={{ textAlign: 'center', padding: 36 }}>
                <p>
                    {this.props.message
                        ? this.props.message
                        : 'An error occurred. Please try again.'}
                </p>
                <Row justify="center">
                    <Button
                        type="primary"
                        onClick={() => this.props.reloadCallBack()}
                    >
                        Reload
                    </Button>
                </Row>
            </div>
        )
    }
}
