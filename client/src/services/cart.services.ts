const APIURL =import.meta.env.VITE_API_URL;
export const addTocart = async( productId:string, quantity:number)=>{
    try {
       const cartRewsponse = await fetch(`${APIURL}/falful/cart/add`,{
        method:  "POST",
        credentials: "include",
        headers:{
            "Content-Type": "application/json"
        },
        body : JSON.stringify({productId, quantity}),
       })

        if (!cartRewsponse.ok) {
      const errorData = await cartRewsponse.json();
      throw new Error(errorData.message || "Failed to add to cart");
    }

    return await cartRewsponse.json(); 
    } catch (error) {
        console.log("error during add to cart:", (error as Error).message);
        throw (error as Error).message;
    }
}

export const viewMyCart = async () => {
  try {
    const res = await fetch(`${APIURL}/falful/cart/myCart`, {
      method: "GET",
      credentials: "include",
    });

    if (!res.ok) throw new Error("Unable to get your cart items");

    const json = await res.json(); // ✅ await JSON here
    return json; // ✅ full response: { success, message, data: { items } }
  } catch (error) {
    console.log("error during view cart:", (error as Error).message);
    throw new Error((error as Error).message);
  }
};

export const  deleteFromCart = async(id:string, qty:number)=>{
  try {
    const responce = await fetch(`${APIURL}/falful/cart/${id}/${qty}/delete`,{
      method: "DELETE",
      credentials: "include"
    })
    if(!responce.ok) throw new Error("unable to delete cart item");
  } catch (error) {
     console.log("error during delete item form cart:", (error as Error).message);
    throw new Error((error as Error).message);
  }

}
