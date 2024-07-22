import { useReducer, useEffect } from 'react';
import axios from 'axios';
import CartContext from './cart-context';
const calculateTotalAmount = (items) => {
  return items.reduce((total, item) => total + item.price * item.amount, 0);
};
const defaultCartState = {
  items: JSON.parse(localStorage.getItem('cartItems')) || [],
  totalAmount: JSON.parse(localStorage.getItem('cartItems'))
    ? calculateTotalAmount(JSON.parse(localStorage.getItem('cartItems')))
    : 0,
};

const cartReducer = (state, action) => {
  if (action.type === 'ADD') {
    const updatedTotalAmount =
      state.totalAmount + action.item.price * action.item.amount;

    const existingCartItemIndex = state.items.findIndex(
      (item) => item.id === action.item.id
    );
    const existingCartItem = state.items[existingCartItemIndex];
    let updatedItems;

    if (existingCartItem) {
      const updatedItem = {
        ...existingCartItem,
        amount: existingCartItem.amount + action.item.amount,
      };
      updatedItems = [...state.items];
      updatedItems[existingCartItemIndex] = updatedItem;
    } else {
      updatedItems = state.items.concat(action.item);
    }
    
     // Save to session and localStorage
     axios.post('http://localhost:8080/add-to-cart', { item: action.item }, { withCredentials: true });
     localStorage.setItem('cartItems', JSON.stringify(updatedItems));

    return {
      items: updatedItems,
      totalAmount: updatedTotalAmount,
    };
  }
  if (action.type === 'REMOVE') {

    let updatedItems,updatedTotalAmount;
    
     const existingCartItemIndex = state.items.findIndex(
      (item) => item.id === action.id
    );
  
    const existingItem = state.items[existingCartItemIndex];
    console.log(state);
    console.log(existingItem)
    if (!existingItem) {
      // Item not found in the cart
      return {
        items: [],
        totalAmount: 0
      }
    }
     updatedTotalAmount = state.totalAmount - existingItem.price;
   
    if (existingItem.amount === 1) {
      updatedItems = state.items.filter(item => item.id !== action.id);
    } else {
      const updatedItem = { ...existingItem, amount: existingItem.amount - 1 };
      updatedItems = [...state.items];
      updatedItems[existingCartItemIndex] = updatedItem;
    }
  
    // Save to session and localStorage
    axios.post('http://localhost:8080/remove-from-cart', { itemId: action.id }, { withCredentials: true });
    localStorage.setItem('cartItems', JSON.stringify(updatedItems));

    return {
      items: updatedItems,
      totalAmount: updatedTotalAmount
    };
    }
  
};

const CartProvider = (props) => {
  const [cartState, dispatchCartAction] = useReducer(
    cartReducer,
    defaultCartState
  );

  
  useEffect(() => {
    if(cartState.items){
      localStorage.setItem('cartItems', JSON.stringify(cartState.items));
    }
  }, [cartState.items]);
  

  const addItemToCartHandler = (item) => {
    dispatchCartAction({ type: 'ADD', item: item });
  };

  const removeItemFromCartHandler = (id) => {
    dispatchCartAction({ type: 'REMOVE', id: id });
  };

  const clearCartHandler = () => {
    dispatchCartAction({ type: 'CLEAR' });
    axios.get('http://localhost:8080/clear-cart', { withCredentials: true });
    localStorage.removeItem('cartItems');
  };

  const cartContext = {
    items: cartState.items,
    totalAmount: cartState.totalAmount,
    addItem: addItemToCartHandler,
    removeItem: removeItemFromCartHandler,
    clearCart: clearCartHandler,
  };

  return (
    <CartContext.Provider value={cartContext}>
      {props.children}
    </CartContext.Provider>
  );
};

export default CartProvider;
