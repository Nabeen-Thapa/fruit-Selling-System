import { parameterDecorator } from "./param-creator";
import { ParamType } from "./types";

export const UploadedFiles = () => parameterDecorator(ParamType.UPLOADED_FILES);
export const UploadedFile = () => parameterDecorator(ParamType.UPLOADED_FILE);
export const Req = () => parameterDecorator(ParamType.REQUEST);
export const Res = () => parameterDecorator(ParamType.RESPONSE);
export const Body = (key?: string) => parameterDecorator(ParamType.BODY, key);
export const Param = (key?: string) => parameterDecorator(ParamType.PARAM, key);
export const Query = (key?: string) => parameterDecorator(ParamType.QUERY, key);
export const Header = (key?: string) => parameterDecorator(ParamType.HEADER, key);