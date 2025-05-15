export enum ParamType{
    BODY = "body",
    PARAM= "param",
    QUERY = "query",
    HEADER = "header",
    REQUEST ="request",
    RESPONSE = "response",
    UPLOADED_FILES = "upload-files",
    UPLOADED_FILE = "upload-file"

}

export interface ParamMetadata {
    index: number; 
    type: ParamType;
    key?: string;
}