import { Edit3, Trash2 } from "lucide-react";
import { ProductPayload } from "./manageproduct";

interface ProductServiceCardProps {
  product: ProductPayload;
  index: number;
  setProductEditIndex: (index: number) => void;
  setProductEdit: (product: any) => void;
  handleDeleteProduct: (id: string) => void;
}

export function ProductServiceCard({
  product,
  index,
  setProductEditIndex,
  setProductEdit,
  handleDeleteProduct,
}: ProductServiceCardProps) {
  return (
    <div
      key={product.id || index}
      className="p-6 rounded-lg bg-white relative shadow-md hover:shadow-lg transition-shadow duration-200 border border-gray-100 flex flex-col"
    >
      <div className="absolute top-4 right-4 flex gap-2 z-10">
        <button
          className="p-2 bg-gray-50 text-gray-600 rounded-md hover:bg-gray-100 transition-colors duration-150"
          onClick={() => {
            setProductEditIndex(index);
            setProductEdit(product);
          }}
          aria-label="Edit product"
        >
          <Edit3 size={16} />
        </button>
        <button
          className="p-2 bg-gray-50 text-red-500 rounded-md hover:bg-gray-100 transition-colors duration-150"
          onClick={() => handleDeleteProduct(String(product.id))}
          aria-label="Delete product"
        >
          <Trash2 size={16} />
        </button>
      </div>

      <div className="pb-4 mb-4 border-b border-gray-100">
        <p className="font-medium uppercase text-gray-500 text-xs mb-1">
          Product Name
        </p>
        <h3 className="text-gray-900 font-bold text-xl leading-snug pr-12 tracking-tight">
          {product.title}
        </h3>
      </div>

      <div className="flex flex-col gap-4 mb-6">
        <div>
          <p className="font-medium text-gray-500 text-[13px] uppercase mb-1">
            Price
          </p>
          <p className="text-gray-900 font-semibold text-lg leading-tight">
            NGN {Number(product.price).toFixed(2)}
          </p>
        </div>
      </div>

      <div className="pt-6 border-t border-gray-100 flex-grow">
        <p className="font-medium uppercase text-gray-500 text-[13px] mb-1">
          Product Description
        </p>
        <p className="text-sm text-gray-700 leading-relaxed">
          {product.description}
        </p>
      </div>
    </div>
  );
}

export default ProductServiceCard;
