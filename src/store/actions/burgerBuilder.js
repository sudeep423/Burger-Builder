import * as actionTypes from './actionTypes'
import axios from '../../axios-orders'

export const addIngredients = (ingredientName) => {
    return {
        type: actionTypes.ADD_INGREDIENTS,
        ingredientName,
    }
}

export const removeIngredients = (ingredientName) => {
    return {
        type: actionTypes.REMOVE_INGREDIENTS,
        ingredientName,
    }
}
export const setIngredients = (ingredients) => {
    return {
        type: actionTypes.SET_INGREDIENTS,
        ingredients,

    }
}

export const fetchIngredientsFailed = () => {
    return {
        type: actionTypes.FETCH_INGREDIENTS_FAILED,
    }
}

export const initIngredients = () => {
    return (dispatch) => {
        axios.get('https://react-my-burger-5f78b.firebaseio.com/Ingredients.json')
            .then(response => {
                dispatch(setIngredients(response.data))
            })
            .catch(error => {
                dispatch(fetchIngredientsFailed())
            })
    }
}