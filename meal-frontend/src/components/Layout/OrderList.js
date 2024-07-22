
import classes from './OrderList.module.css'; // Import CSS module
import axios from 'axios';
const OrderList = ({ orders, onClose, fetchOrders }) => {

    console.log("orders:", orders);
    const handleCancel = async (id) => {
        try {
            let res = await axios.patch(`http://localhost:8080/orders/${id}`, { ordercanceled : true });
            console.log(res);
            let resp = await fetchOrders();
            console.log("resp",resp);
        } catch (error) {
            console.error('Error canceling order:', error);
        }
    };

    console.log("orders->:", orders);
    return (
        <div className={classes.overlay}>
            <div className={classes.orderList}>
                {/* <button className={classes.closeButton} onClick={onClose}>X</button> */}

                <h2>Your Order List</h2>
                {orders.data && orders.data.length > 0 ? (
                    <ul className={classes['cart-item']}>

                        {orders.data.map((order) => (
                            <li key={order.id} className={order.ordercanceled
                                ? classes.canceled : ''} >
                                <h4>{order.name}
                                
                                    <span className={classes.price}>${order.price}x{order.quantity}</span>
                                </h4>
                                    
                                    <span className={classes.price}>{order.totalamount}</span>
                                    {!order.ordercanceled
 && (
                                    <button
                                        className={classes.cancelButton}
                                        onClick={() => handleCancel(order.id)}
                                    >
                                        Cancel
                                    </button>
                                )}
                                {order.ordercanceled && (
                                    <span className={classes.cancelMessage}>Order is canceled</span>
                                )}
                            </li>
                        ))}
                    </ul>)
                    : (
                        <p>Order list is empty</p>)}


                <div className={classes.actions}>
                    <button className={classes['button--alt']} onClick={onClose}>
                        Close
                    </button>
                </div>
            </div>
        </div>
    );

};

export default OrderList;