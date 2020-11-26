import * as actionTypes from './actionTypes'
import axios from '../../axios-orders'


export const purchaseBurgerSuccess = (id, orderData) => {
    return {
        type: actionTypes.PURCHASE_BURGER_SUCCESS,
        orderId: id,
        orderData: orderData,
    }
}

export const purchaseBurgerFail = (error) => {
    return {
        type: actionTypes.PURCHASE_BURGER_FAIL,
        error: error
    }
}


export const purchaseBurger = (orderData, token, userId) => {
    return (dispatch) => {
        dispatch(purchaseBurgerStart())
        const queryParams = '?auth=' + token
        axios.post('/orders.json' + queryParams, orderData)
            .then(response => {
                dispatch(purchaseBurgerSuccess(response.data.name, orderData))
            })
            .catch(error => {
                dispatch(purchaseBurgerFail(error))
            })
    }
}

export const purchaseBurgerStart = () => {
    return {
        type: actionTypes.PURCHASE_BURGER_START
    }
}

export const purchasedInit = () => {
    return {
        type: actionTypes.PURCHASE_INIT
    }
}

export const fetchOrdersSuccess = (orders) => {
    return {
        type: actionTypes.FETCH_ORDERS_SUCCESS,
        orders: orders
    }
}

export const fetchOrdersFail = (error) => {
    return {
        type: actionTypes.FETCH_ORDERS_FAIL,
        error: error
    }
}

export const fetchOrdersStart = () => {
    return {
        type: actionTypes.FETCH_ORDERS_START
    }
}

export const fetchOrders = (token, userId) => {
    return (dispatch,) => {
        const queryParams = '?auth=' + token + '&orderBy="userId"&equalTo="' + userId + '"'
        axios.get('orders.json' + queryParams)
            .then(res => {
                const fetchedOrders = []
                for (let key in res.data) {
                    fetchedOrders.push({
                        ...res.data[key],
                        id: key
                    })
                }
                dispatch(fetchOrdersSuccess(fetchedOrders))
            }).catch(error => {
                dispatch(fetchOrdersFail(error))
            })
    }
}