import React, { Component } from 'react'
import { connect } from 'react-redux'
import ApiManager from '../api/ApiManager'

class LoggedInCatchAll extends Component<any> {
    componentDidMount() {
        if (!ApiManager.isLoggedIn()) {
            this.props.history.push('/login')
        } else {
            this.props.history.push(`/dashboard`)
        }
    }

    render() {
        return <div />
    }
}

function mapStateToProps(state: any) {
    return {}
}

export default connect<any, any>(mapStateToProps, undefined)(LoggedInCatchAll)
