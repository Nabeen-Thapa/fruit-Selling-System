export enum ParamType{
    BODY = "body",
    PARAM= "param",
    QUERY = "query",
    HEADER = "header",
    REQUEST ="request",
    RESPONSE = "response"
}

export interface ParamMetadata {
    index: number; 
    type: ParamType;
    key?: string;
}