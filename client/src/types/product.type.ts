export interface ProductImage {
  file: File;
  preview: string;
  id: number;
}

export type ProductCategory = 'fruit' | 'berry' | 'tropical';

export interface ProductFormState {
  name: string;
  price: string;
  description: string;
  // seller: string;
  // phone: string;
  // email: string;
  quantity: string;
  category: ProductCategory;
  images: ProductImage[];
}

export interface UseProductFormReturn {
  product: ProductFormState;
  loading: boolean;
  showSuccess: boolean;
  isDragging: boolean;
  error: string;
  fileInputRef: React.RefObject<HTMLInputElement>;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  handleDragOver: (e: React.DragEvent<HTMLDivElement>) => void;
  handleDragLeave: () => void;
  handleDrop: (e: React.DragEvent<HTMLDivElement>) => void;
  handleFileInput: (e: React.ChangeEvent<HTMLInputElement>) => void;
  removeImage: (id: number) => void;
  handleSubmit: (e: React.FormEvent) => Promise<void>;
  resetForm: () => void;
  triggerFileInput: () => void;
}


export interface ProductImages {
  url: string;
  altText?: string;
}

export interface Product {
  id: string;
  name: string;
  price: number | string;
  description: string;
  quantity: number;
  seller: string;
  phone: string;
  images: ProductImages[];
}