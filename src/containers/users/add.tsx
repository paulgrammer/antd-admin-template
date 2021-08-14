import { Form, Input, Modal, Select } from 'antd'
import React, { ReactElement } from 'react'
import { connect } from 'react-redux'
import xtend from 'xtend'
import { emitRootKeyChanged } from '../../redux/actions/GlobalActions'
import ApiComponent from '../global/ApiComponent'
import CenteredSpinner from '../global/CenteredSpinner'

class AddUser extends ApiComponent<
    {
        emitRootKeyChanged: Function
        children: ReactElement
        data: any
    },
    any
> {
    constructor(props: any) {
        super(props)
        this.state = {
            isLoading: false,
            isModalVisible: false,
            data: xtend(props.data, {}),
        }
    }

    setData(key: any, value: any) {
        this.setState({
            data: xtend(this.state.data, {
                [`${key}`]: value,
            }),
        })
    }

    add() {
        this.setState({ isLoading: true }, () => {
            this[this.props.data ? 'updatePathData' : 'postPathData']({
                path: '/auth',
                data: xtend(this.state.data),
            })
                .then(() => {
                    this.props.emitRootKeyChanged()
                })
                .catch(() => {
                    this.setState({ isLoading: false })
                })
        })
    }

    render() {
        return (
            <>
                <Modal
                    title={`${this.props.data ? 'UPDATE' : 'NEW'} USER`}
                    visible={this.state.isModalVisible}
                    onOk={this.add.bind(this)}
                    onCancel={() =>
                        this.setState({
                            isModalVisible: false,
                        })
                    }
                    okButtonProps={{ disabled: this.state.isLoading }}
                    cancelButtonProps={{ disabled: this.state.isLoading }}
                    okText={this.props.data ? 'UPDATE' : 'ADD'}
                >
                    {this.state.isLoading ? (
                        <CenteredSpinner />
                    ) : (
                        <Form layout="vertical">
                            <Form.Item
                                label="USERNAME"
                                required={!this.props.data}
                            >
                                <Input
                                    type="text"
                                    placeholder="Username"
                                    name="username"
                                    size="large"
                                    value={this.state.data.username}
                                    onChange={(e: any) =>
                                        this.setData('username', e.target.value)
                                    }
                                />
                            </Form.Item>
                            <Form.Item
                                label="PASSWORD"
                                required={!this.props.data}
                            >
                                <Input.Password
                                    placeholder="Password"
                                    name="password"
                                    size="large"
                                    value={this.state.data.password}
                                    onChange={(e: any) =>
                                        this.setData('password', e.target.value)
                                    }
                                />
                            </Form.Item>
                            <Form.Item label="ROLES">
                                <Select
                                    onChange={(value: any) => {
                                        this.setData('roles', value)
                                    }}
                                    value={this.state.data.roles}
                                    size="large"
                                    mode="multiple"
                                    placeholder="Roles"
                                >
                                    {['ADMIN'].map((role, index) => (
                                        <Select.Option value={role} key={index}>
                                            {role}
                                        </Select.Option>
                                    ))}
                                </Select>
                            </Form.Item>
                        </Form>
                    )}
                </Modal>
                {React.cloneElement(this.props.children, {
                    onClick: () => this.setState({ isModalVisible: true }),
                })}
            </>
        )
    }
}

export default connect<any, any, any>(undefined, {
    emitRootKeyChanged: emitRootKeyChanged,
})(AddUser)
