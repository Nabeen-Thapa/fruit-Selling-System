import React from 'react'
import { placeOrderService, viewBuyerOrders } from '../../services/order.services'
import { toast } from 'react-toastify';

const useOrder = () => {

    const handlePlaceOrder = async (orderData) => {
        try {
            const placeOrder = await placeOrderService(orderData);
            toast.success("your order is placed")
        } catch (error) {
            toast.error(error.message)
        }
    }

    const buyersOrders = async () => {
        try {
            await await viewBuyerOrders();
            toast.success("your order is placed")
        } catch (error) {
            toast.error(error.message)
        }
    }

    return { handlePlaceOrder, buyersOrders }
}

export default useOrder;
