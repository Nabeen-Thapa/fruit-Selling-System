import "reflect-metadata";
import { ParamMetadata, ParamType } from "./types";

export function parameterDecorator(type: ParamType, key?: string){
    return (target:any, methodName : string, paramIndex: number)=>{
        const existingParams: ParamMetadata[] = Reflect.getOwnMetadata("custom:params", target, methodName)|| [];
        existingParams.push({index: paramIndex, type, key});
        Reflect.defineMetadata("custom:params", existingParams, target, methodName);
    };
}