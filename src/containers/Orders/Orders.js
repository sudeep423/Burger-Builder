import React, { Component } from 'react'

import axios from '../../axios-orders'
import Order from '../../components/Order/Order'
import Spinner from '../../components/UI/Spinner/Spinner'
import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler'
import * as action from '../../store/actions/index'
import { connect } from 'react-redux'
class Orders extends Component {

    state = {
        orders: [],
        loading: false,
    }
    componentDidMount() {
        this.props.onFetchOrders(this.props.token, this.props.userId)
    }


    render() {
        let orders = <Spinner />
        if (this.props.orders) {
            orders = <div>
                {this.props.orders.map(order => (
                    <Order
                        key={order.id}
                        ingredients={order.ingredients}
                        price={+order.price} />
                ))}
            </div>
        }

        return (
            <div>
                {orders}
            </div>
        )
    }
}

const mapStateToProps = state => {
    return {
        orders: state.order.orders,
        loading: state.order.loading,
        token: state.auth.token,
        userId: state.auth.userId
    }
}

const mapDispatchToProps = dispatch => {
    return {
        onFetchOrders: (token, userId) => dispatch(action.fetchOrders(token, userId)),
        onFetchOrdersStart: () => dispatch(action.fetchOrdersStart())
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(withErrorHandler(Orders, axios))