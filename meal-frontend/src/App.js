import { Fragment, useState ,useEffect} from 'react';
import axios from 'axios';
import Header from './components/Layout/Header';
import Meals from './components/Meals/Meals';
import Cart from './components/Cart/Cart';
import CartProvider from './store/CartProvider';
import OrderList from './components/Layout/OrderList';
import SessionManager from './components/Session/SessionManager';
function App() {
  const [showShoppingBag, setshowShoppingBag] = useState(false);
  const [cartIsShown,setCartIsShown] = useState(false);
  const [orders, setOrders] = useState([]);

const fetchOrders = async () => {
  return new Promise(async(resolve,reject)=>{
    try {
      const response = await axios.get('http://localhost:8080/orders');
      setOrders(response.data); 
      console.log(response.data);
      resolve(true);
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
  })
  
};

useEffect(() => {
  if (showShoppingBag) {
    fetchOrders();
  }
}, [showShoppingBag]);

  const showShoppingBagHandler = () => {
    setshowShoppingBag(true);
  };

  const hideShoppingBagHandler = () => {
    setshowShoppingBag(false);
  };
 
  const showCartHandler = ()=>{
    setCartIsShown(true);
  }
  const hideCartHandler =()=>{
    setCartIsShown(false);
  }
  return (
    <CartProvider> 
      <SessionManager />
      {cartIsShown && <Cart onClose = {hideCartHandler}/>}
      {showShoppingBag && <OrderList orders={orders} fetchOrders={fetchOrders} onClose={hideShoppingBagHandler} />}
      <Header onShowCart = {showCartHandler} onShowShoppingBag = {showShoppingBagHandler}/>
      <main>
        <Meals />
      </main>
    </CartProvider>
  );
}

export default App;

