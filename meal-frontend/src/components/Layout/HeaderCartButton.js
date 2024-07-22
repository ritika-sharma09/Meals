import { useContext } from "react";
import CartContext from "../../store/cart-context";
import CartIcon from "../Cart/CartIcon";
import classes from "./HeaderCartButton.module.css"
const HeaderCartButton = props =>{
    const cartCtx = useContext(CartContext);
    let numberOfCartItems = 0;
    if(cartCtx.items && cartCtx.items.length>0){
     numberOfCartItems = cartCtx.items.reduce((curNumber,item)=>{
        return curNumber + item.amount
    },0)}
  return <button className={classes.button} onClick={props.onClickButton}>
    <span className={classes.icon}>
        <CartIcon></CartIcon>
    </span>
    <span>
        Your Cart
    </span>
    <span className={classes.badge}>{numberOfCartItems}</span>
  </button>
}

export default HeaderCartButton;
