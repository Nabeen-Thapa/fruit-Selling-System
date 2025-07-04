export const placeOrderService =async(orderData:string)=>{
    try {
        const  orderResponce = await fetch(`http://localhost:5000/product/order/placeorder`,{
            method: "POST",
            credentials: "include",
            headers:{
                "Content-Type": "application/json"
            },
            body: JSON.stringify(orderData)
        })
        if(!orderResponce) throw new Error("uanble to placeorder");
    } catch (error) {
       console.log("place order service errror:", error.message)
       throw error.message; 
    }
}