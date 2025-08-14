export const placeOrderService = async (orderData: string) => {
    try {
        const orderResponce = await fetch(`http://localhost:5000/product/order/placeorder`, {
            method: "POST",
            credentials: "include",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(orderData)
        })
        if (!orderResponce) throw new Error("uanble to placeorder");
    } catch (error) {
        console.log("place order service errror:", error.message)
        throw error.message;
    }
}

export const viewBuyerOrders = async (): Promise<void> => {
    try {
        viewBuyerOrders
        const orderResponce = await fetch(`http://localhost:5000/product/order/viewBuyerOrders`, {
            method: "GET",
            credentials: "include",
            headers: {
                "Content-Type": "application/json"
            },

        });
        if (!orderResponce) throw new Error("uanble to placeorder");
        const orderItems = await orderResponce.json();
        return orderItems;
    } catch (error) {
        console.log("place order service errror:", error.message)
        throw error.message;
    }
}