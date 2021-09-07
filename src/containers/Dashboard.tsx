import { Card, Col, Row, Typography } from 'antd'
import React from 'react'
import { connect } from 'react-redux'
import { RouteComponentProps } from 'react-router'
import { IMobileComponent } from '../models/ContainerProps'
import ApiComponent from './global/ApiComponent'
import Transactions from './stats/transactions.js'

interface Props extends RouteComponentProps {
    isMobile: boolean
}

class Dashboard extends ApiComponent<Props, any> {
    constructor(props: any) {
        super(props)
        this.state = {
            isLoading: false,
            users: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        }
    }

    getOptions(data: any) {
        return {
            xAxis: [
                {
                    type: 'category',
                    data: [
                        'Jan',
                        'Feb',
                        'Mar',
                        'Apr',
                        'May',
                        'Jun',
                        'Jul',
                        'Aug',
                        'Sep',
                        'Oct',
                        'Nov',
                        'Dec',
                    ],
                },
            ],
        }
    }

    render() {
        return (
            <>
                <Row justify="center" gutter={20}>
                    <Col
                        style={{ marginBottom: 20 }}
                        lg={{ span: 11 }}
                        xs={{ span: 23 }}
                    >
                        <Card title="ACCOUNTS">
                            <Transactions />
                        </Card>
                    </Col>
                    <Col
                        style={{ marginBottom: 20 }}
                        lg={{ span: 11 }}
                        xs={{ span: 23 }}
                    >
                        <Card title="TRANSACTIONS">
                            <Transactions />
                        </Card>
                    </Col>
                </Row>
                <Row justify="center" gutter={20}>
                    <Col
                        style={{ marginBottom: 20 }}
                        lg={{ span: 11 }}
                        xs={{ span: 23 }}
                    >
                        <Card
                            style={{ marginBottom: 20, borderRadius: '20px' }}
                            title={this.props.isMobile && 'ACCOUNTS'}
                        >
                            <div>
                                ACTIVE: {` `}
                                <Typography.Text strong>0</Typography.Text>
                            </div>
                            <div>
                                INACTIVE: {` `}
                                <Typography.Text strong> 0</Typography.Text>
                            </div>
                        </Card>
                    </Col>
                    <Col
                        style={{ marginBottom: 20 }}
                        lg={{ span: 11 }}
                        xs={{ span: 23 }}
                    >
                        <Card
                            style={{ borderRadius: '20px' }}
                            title={this.props.isMobile && 'TRANSACTIONS'}
                        >
                            <div>
                                DEPOSITS: {` `}
                                <Typography.Text strong>0</Typography.Text>
                            </div>
                            <div>
                                WITHDRAWS: {` `}
                                <Typography.Text strong> 0</Typography.Text>
                            </div>
                        </Card>
                    </Col>
                </Row>
            </>
        )
    }
}

function mapStateToProps(state: any) {
    return {
        isMobile: state.globalReducer.isMobile,
    }
}

export default connect<IMobileComponent, any, any>(
    mapStateToProps,
    undefined
)(Dashboard)
