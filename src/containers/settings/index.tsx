import { Card, Col, Row } from 'antd'
import React from 'react'
import { connect } from 'react-redux'
import { IMobileComponent } from '../../models/ContainerProps'
import StorageHelper from '../../utils/StorageHelper'
import ApiComponent from '../global/ApiComponent'
import ChangePass from './ChangePass'

class Settings extends ApiComponent<
    {
        isMobile: boolean
        isAdmin: boolean
    },
    any
> {
    render() {
        return (
            <div>
                <Row justify="center" gutter={20}>
                    {this.props.isAdmin && (
                        <Col
                            style={{ marginBottom: 20 }}
                            lg={{ span: 10 }}
                            xs={{ span: 23 }}
                        >
                            <Card
                                style={{ height: '100%' }}
                                title="CHANGE PASSWORD"
                            >
                                <ChangePass isMobile={this.props.isMobile} />
                            </Card>
                        </Col>
                    )}
                </Row>
            </div>
        )
    }
}

function mapStateToProps(state: any) {
    return {
        isMobile: state.globalReducer.isMobile,
        isAdmin: StorageHelper.isAdmin(),
    }
}

export default connect<IMobileComponent, any, any>(
    mapStateToProps,
    undefined
)(Settings)
