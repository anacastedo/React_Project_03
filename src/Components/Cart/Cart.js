import classes from './Cart.module.css';
import Modal from "../UI/Modal";
import {useContext, useState} from "react";
import CartContext from "../../store/cart-context";
import CartItem from "./CartItem";
import Checkout from "./Checkout";

const Cart = props =>{
    const [isCheckout, setIsCheckout]=useState(false)
    const cartCtx=useContext(CartContext);
    const totalAmount = `$${cartCtx.totalAmount.toFixed(2)}`
    const hasItems=cartCtx.items.length>0;

    const cartItemRemoveHandler = id =>{
        cartCtx.removeItem(id)
    }
    const cartItemAddHandler=item=>{
        cartCtx.addItem({...item, amount:1})
    }

    const orderHandler = () =>{
        setIsCheckout(true)

    }

    const submitOrderHandler = async (userData) =>{
        await fetch('https://react-project-03-134f2-default-rtdb.europe-west1.firebasedatabase.app/orders.json', {
            method: 'POST',
            body: JSON.stringify({
                user: userData,
                orderedItems: cartCtx.items
            })
        })
    }
    const cartItems = <ul className={classes['cart-items']}>
        {cartCtx.items.map((item, id)=>(
            <CartItem
                key={item.id+id}
                name={item.name}
                amount={item.amount}
                price={item.price}
                onRemove={cartItemRemoveHandler.bind(null, item.id)}
                onAdd={cartItemAddHandler.bind(null, item)}
            />
        ))}</ul>

    const modalActions = <div className={classes.actions}>
            <button className={classes['button--alt']} onClick={props.onClose}>Close</button>
            {hasItems && <button onClick={orderHandler} className={classes.button}>Order</button>}
        </div>

return <Modal onClose={props.onClose}>
    {cartItems}
    <div className={classes.total}>
        <span>Total Amount</span>
        <span>{totalAmount}</span>
    </div>
    {isCheckout && <Checkout onConfirm={submitOrderHandler} onCancel={props.onClose} />}
    {!isCheckout && modalActions}

</Modal>
}
export default Cart;