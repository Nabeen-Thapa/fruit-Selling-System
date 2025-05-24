"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ParamType = void 0;
var ParamType;
(function (ParamType) {
    ParamType["BODY"] = "body";
    ParamType["PARAM"] = "param";
    ParamType["QUERY"] = "query";
    ParamType["HEADER"] = "header";
    ParamType["REQUEST"] = "request";
    ParamType["RESPONSE"] = "response";
    ParamType["UPLOADED_FILES"] = "upload-files";
    ParamType["UPLOADED_FILE"] = "upload-file";
})(ParamType || (exports.ParamType = ParamType = {}));
