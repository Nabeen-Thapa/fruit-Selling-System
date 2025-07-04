import React from 'react'
import { placeOrderService } from '../../services/order.services'
import { toast } from 'react-toastify';

const useOrder = () => {
    
 const placeOrder = async(orderData)=>{
    try {
        await placeOrderService(orderData);
       toast.success("your order is placed")
    } catch (error) {
        toast.error(error.message)
    }
 }
}

export default useOrder;
