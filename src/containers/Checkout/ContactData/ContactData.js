import React, { Component } from 'react'

import Spinner from '../../../components/UI/Spinner/Spinner'
import axios from '../../../axios-orders'
import classes from './ContactData.css'
import Button from '../../../components/UI/Button/Button'
import Input from '../../../components/UI/Input/Input'
import { connect } from 'react-redux'
import withErrorHandler from '../../../hoc/withErrorHandler/withErrorHandler'
import * as actions from '../../../store/actions/index'
import { updateObject, checkValidity } from '../../../shared/utility'

class ContactData extends Component {
    state = {
        orderForm: {
            name: {
                elementType: 'input',
                elementConfig: {
                    type: 'text',
                    placeholder: 'Name'
                },
                value: '',
                validation: {
                    required: true
                },
                valid: false,
                touched: false
            },
            street: {
                elementType: 'input',
                elementConfig: {
                    type: 'text',
                    placeholder: 'Street'
                },
                value: '',
                validation: {
                    required: true
                },
                valid: false,
                touched: false
            },
            zipcode: {
                elementType: 'input',
                elementConfig: {
                    type: 'text',
                    placeholder: 'Zip Code'
                },
                value: '',
                validation: {
                    required: true,
                    minLength: 6,
                    maxLength: 6,
                },
                valid: false,
                touched: false,
            },
            country: {
                elementType: 'input',
                elementConfig: {
                    type: 'text',
                    placeholder: 'Country'
                },
                value: '',
                validation: {
                    required: true
                },
                valid: false,
                touched: false
            },
            email: {
                elementType: 'input',
                elementConfig: {
                    type: 'text',
                    placeholder: 'E-Mail'
                },
                value: '',
                validation: {
                    required: true
                },
                valid: false,
                touched: false
            },
            deliveryMethod: {
                elementType: 'select',
                elementConfig: {
                    options: [
                        { value: 'fastest', displayValue: 'fastest' },
                        { value: 'Cheapest', displayValue: 'Cheapest' },
                    ]
                },
                value: 'fastest',
                validation: {},
                valid: true
            }
        },
        formIsValid: false
    }


    orderHandler = (event) => {
        event.preventDefault()
        const formData = {}
        for (let formElementIdentifier in this.state.orderForm) {
            formData[formElementIdentifier] = this.state.orderForm[formElementIdentifier].value
        }
        const order = {
            OrderData: formData,
            ingredients: this.props.ings,
            price: this.props.price,
            userId: this.props.userId
        }
        this.props.onOrderBurger(order, this.props.token)
    }

    inputChangedHandler = (event, inputIdentifier) => {
        const updatedFormElement = updateObject(this.state.orderForm[inputIdentifier], {
            value: event.target.value,
            valid: checkValidity(event.target.value, this.state.orderForm[inputIdentifier].validation),
            touched: true
        })

        const updatedOrderForm = updateObject(this.state.orderForm, {
            [inputIdentifier]: updatedFormElement
        })

        let formIsValid = true;
        for (let inputIdentifier in updatedOrderForm) {
            formIsValid = formIsValid & updatedOrderForm[inputIdentifier].valid
        }
        this.setState({ orderForm: updatedOrderForm, formIsValid: formIsValid === 1 });
    }
    render() {

        const formElementsArray = []
        for (let key in this.state.orderForm) {
            formElementsArray.push({
                id: key,
                config: this.state.orderForm[key]
            })
        }


        let form = <div className={classes.ContactData}>
            <h4>Enter your contact Data</h4>
            <form onSubmit={this.orderHandler}>
                {formElementsArray.map(formElement => (
                    <Input elementType={formElement.config.elementType}
                        elementConfig={formElement.config.elementConfig}
                        value={formElement.config.value}
                        key={formElement.id}
                        invalid={!formElement.config.valid}
                        shouldValidate={formElement.config.validation}
                        touched={formElement.config.touched}
                        changed={(event) => this.inputChangedHandler(event, formElement.id)} />
                ))}
                <Button btnType="Success" disabled={!this.state.formIsValid} >ORDER</Button>
            </form>
        </div>
        if (this.props.loading) {
            form = <Spinner />
        }
        return (
            <div>
                {form}
            </div>
        )
    }
}


const mapStateToProps = state => {
    return {
        ings: state.burgerBuilder.ingredients,
        price: state.burgerBuilder.totalPrice,
        loading: state.order.loading,
        token: state.auth.token,
        userId: state.auth.userId
    }
}

const mapDispatchToProps = dispatch => {
    return {
        onOrderBurger: (orderData, token) => dispatch(actions.purchaseBurger(orderData, token)),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(withErrorHandler(ContactData, axios))