import React, { Component } from 'react'
import { connect } from 'react-redux'

import Aux from '../Auxiliary/Auxiliary'
import classes from './Layout.css'
import Toolbar from '../../components/Navigation/Toolbar/Toolbar'
import SideDrawer from '../../components/Navigation/SideDrawer/SideDrawer'


class Layout extends Component {

    state = {
        showSideDrawer: false
    }

    SideDrawerClosedHandler = () => {
        this.setState({ showSideDrawer: false })
    }

    SideDrawerToggleHandler = () => {
        this.setState((prevState) => { return { showSideDrawer: !prevState.showSideDrawer } })
    }

    render() {
        return (
            <Aux >
                <Toolbar
                    isAuth={this.props.isAuthenticated}
                    clicked={this.SideDrawerToggleHandler} />
                <SideDrawer
                    isAuth={this.props.isAuthenticated}
                    clicked={this.SideDrawerClosedHandler}
                    show={this.state.showSideDrawer} />
                <div>Toolbar , SideDrawer ,Backdrop</div>
                <main className={classes.Content}>
                    {this.props.children}
                </main>
            </Aux>
        )
    }
}

const mapStateToProps = state => {
    return {
        isAuthenticated: state.auth.token !== null
    }
}


export default connect(mapStateToProps)(Layout)