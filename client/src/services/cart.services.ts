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
        throw error;
    }
}