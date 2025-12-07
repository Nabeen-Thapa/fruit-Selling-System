"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteImage = exports.uploadImage = void 0;
const cloudinary_1 = require("cloudinary");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
cloudinary_1.v2.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true,
    timeout: 60000,
});
const uploadImage = async (filePath) => {
    try {
        const result = await cloudinary_1.v2.uploader.upload(filePath, {
            folder: 'products',
            quality: 'auto:good', // Better compression
            format: 'webp' // Modern format
        });
        return {
            url: result.secure_url,
            publicId: result.public_id
        };
    }
    catch (error) {
        console.error('Cloudinary upload error:', error);
        throw new Error('Failed to upload image');
    }
};
exports.uploadImage = uploadImage;
const deleteImage = async (publicId) => {
    await cloudinary_1.v2.uploader.destroy(publicId);
};
exports.deleteImage = deleteImage;
