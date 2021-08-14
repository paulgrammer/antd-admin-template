import {
    BarsOutlined,
    CreditCardOutlined,
    DashboardOutlined,
    LogoutOutlined,
    SettingOutlined,
    TeamOutlined,
} from '@ant-design/icons'
import { Button, Col, Layout, Menu, Row } from 'antd'
import React, { Fragment, RefObject } from 'react'
import { connect } from 'react-redux'
import { Route, RouteComponentProps, Switch } from 'react-router'
import { Link } from 'react-router-dom'
import ApiManager from '../api/ApiManager'
import * as GlobalActions from '../redux/actions/GlobalActions'
import StorageHelper from '../utils/StorageHelper'
import Dashboard from './Dashboard'
import ApiComponent from './global/ApiComponent'
import ClickableLink from './global/ClickableLink'
import DarkModeSwitch from './global/DarkModeSwitch'
import LoggedInCatchAll from './LoggedInCatchAll'
import Settings from './settings'
import Users from './users'

const { Header, Content, Sider } = Layout

interface RootPageInterface extends RouteComponentProps<any> {
    rootElementKey: string
    emitSizeChanged: () => void
    isMobile: boolean
    isAdmin: boolean
}

class PageRoot extends ApiComponent<
    RootPageInterface,
    {
        collapsed: boolean
        me: any
    }
> {
    private mainContainer: RefObject<HTMLDivElement>

    constructor(props: any) {
        super(props)
        this.mainContainer = React.createRef()
        this.state = {
            collapsed: false,
            me: {},
        }
    }

    updateDimensions = () => this.props.emitSizeChanged()

    componentWillUnmount() {
        // @ts-ignore
        if (super.componentWillUnmount) super.componentWillUnmount()
        this.updateDimensions()
        window.removeEventListener('resize', this.updateDimensions)
    }

    componentDidUpdate(prevProps: any) {
        // Typical usage (don't forget to compare props):
        if (
            this.props.location.pathname !== prevProps.location.pathname &&
            this.props.isMobile
        ) {
            this.setState({ collapsed: true })
        }
    }
    componentDidMount() {
        const self = this
        this.updateDimensions()
        window.addEventListener('resize', this.updateDimensions)

        if (!ApiManager.isLoggedIn()) {
            this.goToLogin()
        } else {
            this.setState({
                collapsed: StorageHelper.getSiderCollapsedStateFromLocalStorage(),
            })
        }
    }

    goToLogin() {
        this.props.history.push('/login')
    }

    logout() {
        this.apiManager.setAuthToken('')
        StorageHelper.setAdmin(false)
        this.goToLogin()
    }

    createUpdateAvailableIfNeeded() {
        const self = this

        return (
            <Fragment>
                <ClickableLink
                    onLinkClicked={() => self.props.history.push('/settings')}
                ></ClickableLink>
            </Fragment>
        )
    }

    toggleSider = () => {
        StorageHelper.setSiderCollapsedStateInLocalStorage(
            !this.state.collapsed
        )
        this.setState({ collapsed: !this.state.collapsed })
    }

    render() {
        const self = this
        const MENU_ITEMS = [
            {
                key: 'dashboard',
                name: 'Dashboard',
                icon: <DashboardOutlined />,
            },
            {
                key: 'menu_2',
                name: 'SUB MENU',
                icon: <CreditCardOutlined />,
                subitems: [{ name: 'sub menu', key: 'sub_menu' }],
            },
            ...(this.props.isAdmin
                ? [
                      {
                          key: 'users',
                          name: 'USERS',
                          icon: <TeamOutlined />,
                      },
                  ]
                : []),
            {
                key: 'settings',
                name: 'SETTINGS',
                icon: <SettingOutlined />,
            },
        ]

        return (
            <Layout className="full-screen">
                <Header
                    className="header"
                    style={{
                        padding: `0 ${this.props.isMobile ? 15 : 50}px`,
                    }}
                >
                    <div>
                        <Row>
                            {this.props.isMobile && (
                                <Col span={4}>
                                    <Button
                                        ghost
                                        icon={<BarsOutlined />}
                                        onClick={this.toggleSider}
                                    />
                                </Col>
                            )}
                            <Col lg={{ span: 12 }} xs={{ span: 20 }}>
                                <div>
                                    <h3 style={{ color: '#fff' }}>
                                        <img
                                            alt="logo"
                                            src="/icon.png"
                                            style={{
                                                height: 35,
                                                width: 35,
                                                marginRight: 10,
                                            }}
                                        />
                                        ADMIN
                                    </h3>
                                </div>
                            </Col>
                            {!self.props.isMobile && (
                                <Col span={12}>
                                    <Row justify="end">
                                        <span
                                            style={{
                                                marginRight: 70,
                                            }}
                                        >
                                            <DarkModeSwitch />
                                        </span>
                                        <span>
                                            <span
                                                style={{
                                                    border: '1px solid #1b8ad3',
                                                    borderRadius: 5,
                                                    padding: 8,
                                                }}
                                            >
                                                <ClickableLink
                                                    onLinkClicked={this.logout.bind(
                                                        this
                                                    )}
                                                >
                                                    LOGOUT {` `}
                                                    <LogoutOutlined />
                                                </ClickableLink>
                                            </span>
                                        </span>
                                    </Row>
                                </Col>
                            )}
                        </Row>
                    </div>
                </Header>

                <Layout>
                    <Sider
                        breakpoint="lg"
                        trigger={this.props.isMobile && undefined}
                        collapsible
                        collapsed={this.state.collapsed}
                        width={200}
                        collapsedWidth={self.props.isMobile ? 0 : 80}
                        style={{ zIndex: 2 }}
                        onCollapse={this.toggleSider}
                    >
                        <Menu
                            selectedKeys={[
                                this.props.location.pathname.substring(1),
                            ]}
                            theme="dark"
                            mode="inline"
                            defaultSelectedKeys={['users']}
                            style={{ height: '100%', borderRight: 0 }}
                        >
                            {MENU_ITEMS.map((item) =>
                                item.subitems?.length ? (
                                    <Menu.SubMenu
                                        key={item.key}
                                        icon={item.icon}
                                        title={item.name}
                                    >
                                        {item.subitems.map((subItem) => (
                                            <Menu.Item key={subItem.key}>
                                                <Link
                                                    to={`/${subItem.key}`}
                                                    className="nav-text"
                                                >
                                                    {subItem.name}
                                                </Link>
                                            </Menu.Item>
                                        ))}
                                    </Menu.SubMenu>
                                ) : (
                                    <Menu.Item key={item.key}>
                                        <Link
                                            to={`/${item.key}`}
                                            className="nav-text"
                                        >
                                            {item.icon}
                                            <span>{item.name}</span>
                                        </Link>
                                    </Menu.Item>
                                )
                            )}

                            {this.props.isMobile && (
                                <Fragment>
                                    <div
                                        style={{
                                            backgroundColor:
                                                'rgba(255, 255, 255, 0.65)',
                                            height: 1,
                                            width: '80%',
                                            margin: '15px auto',
                                        }}
                                    />
                                    <div
                                        className="ant-menu-item"
                                        role="menuitem"
                                        style={{ paddingLeft: 24 }}
                                    >
                                        <ClickableLink
                                            onLinkClicked={this.logout.bind(
                                                this
                                            )}
                                        >
                                            <LogoutOutlined />
                                            LOGOUT
                                        </ClickableLink>
                                    </div>
                                </Fragment>
                            )}
                        </Menu>
                    </Sider>
                    <Content>
                        <div
                            key={self.props.rootElementKey}
                            ref={self.mainContainer}
                            style={{
                                paddingTop: 12,
                                paddingBottom: 0,
                                height: '100%',
                                overflowY: 'scroll',
                                marginRight: self.state.collapsed
                                    ? 0
                                    : self.props.isMobile
                                    ? -200
                                    : 0,
                                transition: 'margin-right 0.3s ease',
                            }}
                            id="main-content-layout"
                        >
                            <Switch>
                                <Route
                                    path="/dashboard/"
                                    component={Dashboard}
                                />
                                <Route path="/users/" component={Users} />
                                <Route path="/settings/" component={Settings} />
                                <Route path="/" component={LoggedInCatchAll} />
                            </Switch>
                        </div>
                    </Content>
                </Layout>
            </Layout>
        )
    }
}

function mapStateToProps(state: any) {
    return {
        rootElementKey: state.globalReducer.rootElementKey,
        isMobile: state.globalReducer.isMobile,
        isAdmin: StorageHelper.isAdmin(),
    }
}

export default connect(mapStateToProps, {
    emitSizeChanged: GlobalActions.emitSizeChanged,
})(PageRoot)
