import { useContext, useState } from 'react';
import axios from 'axios';
import Modal from '../UI/Modal';
import CartItem from './CartItem';
import classes from './Cart.module.css';
import CartContext from '../../store/cart-context';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle } from '@fortawesome/free-solid-svg-icons';
const Cart = (props) => {
  const [showPopup, setShowPopup] = useState(false);
  const cartCtx = useContext(CartContext);
  const totalAmount = `$${cartCtx.totalAmount.toFixed(2)}`;
  const hasItems = cartCtx.items.length > 0;
  const handleOrder = async () => {
    try {
      if (cartCtx.items.length > 0) {
        let orderData = cartCtx.items.map((item) => {
          return { name: item.name, price: item.price, quantity: item.amount, totalAmount: `$${(item.price * item.amount).toFixed(2)}` }
        });

        if (orderData.length > 0) {
          const response = await axios.post('http://localhost:8080/orders', orderData);
          console.log('Order response:', response);
        }
      }
      // const response = await axios.post('/order', {  });
      // fetchOrders(); // Refresh the order list after placing an order
      // setShowOverlay(true); // Show the overlay with the updated order list
    } catch (error) {
      console.error('Error placing order:', error);
    }
  };
  const handleOrderClick = async() => {
    // Show the popup
    
    await handleOrder();
    setShowPopup(true);


    // Hide the popup after 3 seconds (optional)
    setTimeout(() => {
      setShowPopup(false);
      props.onClose();
    }, 3000);
  };


  const cartItemRemoveHandler = (id) => {
    cartCtx.removeItem(id);
  };

  const cartItemAddHandler = (item) => {
    cartCtx.addItem({ ...item, amount: 1 });
  };

  const cartItems = (
    <ul className={classes['cart-items']}>
      {cartCtx.items.map((item) => (
        <CartItem
          key={item.id}
          name={item.name}
          amount={item.amount}
          price={item.price}
          onRemove={cartItemRemoveHandler.bind(null, item.id)}
          onAdd={cartItemAddHandler.bind(null, item)}
        />
      ))}
    </ul>
  );

  return (
    <>
      <Modal onClose={props.onClose}>
        {cartItems}
        <div className={classes.total}>
          <span>Total Amount</span>
          <span>{totalAmount}</span>
        </div>

        <div className={classes.actions}>
          <button className={classes['button--alt']} onClick={props.onClose}>
            Close
          </button>
          {hasItems && <button className={classes.button} onClick={handleOrderClick}>Order</button>}
        </div>

      </Modal>
     
        {showPopup && (
          <div className={classes.popup}>
            <div className={classes["popup-content"]}>
              <span className={classes.close} onClick={() => setShowPopup(false)}>&times;</span>
              <FontAwesomeIcon icon={faCheckCircle} style={{ color: 'green', fontSize: '3rem', marginTop:'70px' }} />
              <p style={{ color: 'green', fontSize: '1.5rem' }}>Success! Your order has been placed.</p>
            </div>
          </div>
        )}
     
    </>
  );
};

export default Cart;