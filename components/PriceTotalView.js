import React from 'react';
import priceProcess from './api/priceProcess';

class PriceTotalView extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            price: undefined
        };
        this.handleCheckboxUpdate = this.handleCheckboxUpdate.bind(this);

        this.populatePrices(props.ingredientsCollection).then(() => {
            this.setState((state, props) => {
                state.price = props.ingredientsCollection.getAllSelected()
                    .map(ingredient => ingredient.getPrice())
                    .reduce((soFar, val) => soFar + val, 0);
                return state;
            });
        });

        this.props.listener.onUpdate = this.handleCheckboxUpdate;
    }

    componentWillUpdate(nextProps, nextState, nextContext) {
        nextProps.listener.onUpdate = this.handleCheckboxUpdate;
    }

    async populatePrices(ingredientsCollection) {
        return await priceProcess(ingredientsCollection.getUnderlyingArray());
    }

    handleCheckboxUpdate(ingredient) {
        console.log(ingredient);
        this.setState((state, props) => {
            console.log(this.state.price);
            if (this.state.price !== undefined && ingredient.getPrice() !== parseFloat('NaN')) {
                if (ingredient.isSelected()) {
                    console.log('selected', ingredient.getPrice());
                    state.price += ingredient.getPrice();
                } else {
                    console.log('unselected', ingredient.getPrice());
                    state.price -= ingredient.getPrice();
                }
            }

            console.log(state.price);
            return state;
        });
    }

    render() {
        if (this.state.price === undefined) {
            return null;
        } else {
            return (
                <span>{'$' + (this.state.price / 100).toString()}</span>);
        }
    }
}

export default PriceTotalView;
