const APIURL =import.meta.env.VITE_API_URL;

export const placeOrderService = async (orderData: string) => {
    try {
        const orderResponce = await fetch(`${APIURL}/product/order/placeorder`, {
            method: "POST",
            credentials: "include",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(orderData)
        })
        if (!orderResponce) throw new Error("uanble to placeorder");
    } catch (error) {
        console.log("place order service errror:", (error as Error).message)
        throw (error as Error).message;
    }
}

export const viewBuyerOrders = async (): Promise<void> => {
    try {
        viewBuyerOrders
        const orderResponce = await fetch(`${APIURL}/product/order/viewBuyerOrders`, {
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
        console.log("place order service errror:", (error as Error).message)
        throw (error as Error).message;
    }
}