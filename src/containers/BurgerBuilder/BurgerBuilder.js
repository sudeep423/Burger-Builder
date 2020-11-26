import React, { Component } from 'react'
import Aux from '../../hoc/Auxiliary/Auxiliary'
import Burger from '../../components/Burger/Burger'
import BuildControls from '../../components/Burger/BuildControls/BuildControls'
import Modal from '../../components/UI/Modal/Modal'
import OrderSummary from '../../components/Burger/OrderSummary/OrderSummary'
import Spinner from '../../components/UI/Spinner/Spinner'
import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler'
import { connect } from 'react-redux'
import axios from '../../axios-orders'
import * as actions from '../../store/actions/index'

export class BurgerBuilder extends Component {
    // constructor(props){
    //     super(props)
    //     this.state = {...}
    // }

    state = {
        purchasing: false,
        loading: false,
        error: false
    }

    componentDidMount() {
        this.props.onInitIngredients()
    }


    updatePurchaseState(ingredients) {
        const sum = Object.keys(ingredients).map(igKey => {
            return ingredients[igKey]
        }).reduce((sum, el) => {
            return sum + el
        }, 0)
        return sum > 0
    }



    purchaseHandler = () => {
        if (this.props.isAuthenticated) {
            this.setState({ purchasing: true })
        } else {
            this.props.onSetRedirectPath('/checkout')
            this.props.history.push('/auth')
        }
    }

    purchaseCancelHandler = () => {
        this.setState({ purchasing: false })
    }

    purchaseContinueHandler = () => {
        this.props.onInitPurchased()
        this.props.history.push('/checkout')
    }
    render() {
        const disabledInfo = {
            ...this.props.ings
        }
        for (let key in disabledInfo) {
            disabledInfo[key] = disabledInfo[key] <= 0
        }
        let orderSummary = this.props.ings ? <OrderSummary
            ingredients={this.props.ings}
            purchaseCanceled={this.purchaseCancelHandler}
            purchaseContinue={this.purchaseContinueHandler}
            price={this.props.price}
        /> : null
        let burger = this.props.error ? <p>ingredients can't be loaded</p> : <Spinner />
        if (this.props.ings) {
            burger = <Aux>
                <Burger ingredients={this.props.ings}></Burger>
                <BuildControls
                    ingredientAdded={this.props.onIngredientAdded}
                    ingredientRemoved={this.props.onIngredientRemoved}
                    disabled={disabledInfo}
                    purchaseable={this.updatePurchaseState(this.props.ings)}
                    price={this.props.price}
                    isAuth={this.props.isAuthenticated}
                    order={this.purchaseHandler} />
            </Aux>
        }
        return (
            <Aux>
                <Modal show={this.state.purchasing} modalClosed={this.purchaseCancelHandler}>
                    {orderSummary}
                </Modal>
                {burger}
            </Aux>
        )
    }
}

const mapStateToProps = state => {
    return {
        ings: state.burgerBuilder.ingredients,
        price: state.burgerBuilder.totalPrice,
        error: state.burgerBuilder.error,
        isAuthenticated: state.auth.token !== null
    }
}


const mapDispatchToProps = dispatch => {
    return {
        onIngredientAdded: (igName) => dispatch(actions.addIngredients(igName)),
        onIngredientRemoved: (igName) => dispatch(actions.removeIngredients(igName)),
        onInitIngredients: () => dispatch(actions.initIngredients()),
        onInitPurchased: () => dispatch(actions.purchasedInit()),
        onSetRedirectPath: (path) => dispatch(actions.setAuthRedirectPath(path))
    }
}




export default connect(mapStateToProps, mapDispatchToProps)(withErrorHandler(BurgerBuilder, axios))