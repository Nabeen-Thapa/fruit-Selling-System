export const addTocart = async( productId:string, quantity:number)=>{
    try {
       const cartRewsponse = await fetch(`http://localhost:5000/falful/cart/add`,{
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
        console.log("error during add to cart:", error.message);
        throw error.message;
    }
}

export const viewMyCart = async () => {
  try {
    const res = await fetch("http://localhost:5000/falful/cart/myCart", {
      method: "GET",
      credentials: "include",
    });

    if (!res.ok) throw new Error("Unable to get your cart items");

    const json = await res.json(); // ✅ await JSON here
    return json; // ✅ full response: { success, message, data: { items } }
  } catch (error: any) {
    console.log("error during view cart:", error.message);
    throw new Error(error.message);
  }
};
