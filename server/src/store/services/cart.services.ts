import { Route } from "../../common/decorators/route.decoder";
import { Controller } from "../../common/decorators/controller.decoder";

@Controller("/product/cart")
export class cartServices{

    @Route("post", "/add")
    async addToCart(){
        
    }
}