import { useEffect, useContext } from 'react';
import axios from 'axios';
import CartContext from '../../store/cart-context';

const SessionManager = () => {
  const cartCtx = useContext(CartContext);

  const checkSession = async () => {
    try {
      const response = await axios.get('http://localhost:8080/session-check', { withCredentials: true });
      if (response.data.expired) {
        cartCtx.removeItem(cartCtx.items.id);
        localStorage.removeItem('cartItems');
        alert('Your session has expired.');
      }
    } catch (error) {
      console.error('Error checking session:', error);
    }
  };

  useEffect(() => {
    const sessionCheckInterval = setInterval(() => {
      checkSession();
    }, 60000); // Check session every 60 seconds

    return () => clearInterval(sessionCheckInterval);
  }, []);

  return null;
};

export default SessionManager;
