import { useEffect, useState } from "react";

import { useAuth } from "../../contexts/AuthContext";
import { useNotificationContext } from "../../contexts/NotificationContext";
import { useLoading } from "../../contexts/LoadingContext";
import {
  createProduct,
  deleteProduct,
  getAllProducts,
  updateProduct,
} from "../../api-services/product.service";
import { ContentHOC } from "../../components/nocontent";
import ProductServiceCard from "./product";
import { Plus } from "feather-icons-react";

export interface ProductPayload {
  title: string;
  price: string;
  description: string;
  image: null | File;
  id: number;
}

export function ManageProducts() {
  const auth = useAuth();
  const id = auth?.user?.id;
  const { setLoading, setLoadingText } = useLoading();
  const { openNotification } = useNotificationContext();

  // New state for products
  const [products, setProducts] = useState<any[]>([]);
  const [productLoading, setProductLoading] = useState(false);
  const [productErr, setProductErr] = useState<string | null>(null);
  const [showProductForm, setShowProductForm] = useState(false);
  const [newProductForm, setNewProductForm] = useState<ProductPayload>({
    title: "",
    price: "",
    description: "",
    image: null,
    id: 0,
  });
  const [productImgFile, setProductImgFile] = useState<File | null>(null);
  const [productEdit, setProductEdit] = useState<ProductPayload>();
  const [productEditIndex, setProductEditIndex] = useState<number>();
const validateProductForm = (): boolean => {
    console.log({newProductForm})
  // Check for required text fields
  if (!newProductForm.title.trim()) {
    openNotification("topRight", "Validation Error", "Please enter a product name.", "error");
    return false;
  }
  if (!newProductForm.price) {
    openNotification("topRight", "Validation Error", "Please enter a product price.", "error");
    return false;
  }
  if (isNaN(Number(newProductForm.price)) || Number(newProductForm.price) <= 0) {
    openNotification("topRight", "Validation Error", "Please enter a valid price greater than 0.", "error");
    return false;
  }
  if (!newProductForm.description.trim()) {
    openNotification("topRight", "Validation Error", "Please enter a product description.", "error");
    return false;
  }

  // Check for a valid image file
  if (!productImgFile) {
    openNotification("topRight", "Validation Error", "Please upload a product image.", "error");
    return false;
  }

  // If all checks pass
  return true;
};
  const fetchProducts = async () => {
    setProductLoading(true);
    setProductErr(null);
    try {
      const res = await getAllProducts({ userId: auth?.user?.id }, auth.token);
      console.log({res})
      setProducts(res?.data?.response || []);
    } catch (error: any) {
      console.error(error);
      setProductErr("Could not fetch products.");
    } finally {
      setProductLoading(false);
    }
  };
  const handleNewProductFormChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setNewProductForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  const handleProductFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setProductImgFile(file);
    }
  };

  const handleSaveNewProduct = async () => {
    const valid = validateProductForm()
    if(!valid) return
    try {
      setLoading(true);
      setLoadingText("Saving new product...");
      const formData = new FormData();
      formData.append("title", newProductForm.title);
      formData.append("description", newProductForm.description);
      formData.append("price", newProductForm.price);

      if (productImgFile) {
        formData.append("attachment", productImgFile);
        formData.append("attachment","")
      }

      await createProduct(formData, auth.token);
      setShowProductForm(false);
      openNotification(
        "topRight",
        "New Product Added Successfully",
        "",
        "success",
      );
      fetchProducts();
    } catch (error) {
      console.error(error);
      openNotification(
        "topRight",
        "Error saving product",
        error?.toString() || "Something went wrong",
        "error",
      );
    } finally {
      setLoading(false);
      setLoadingText("");
    }
  };

  const saveEditedProduct = async () => {
    if (!productEdit || productEditIndex === undefined) return;
    try {
      setLoading(true);
      setLoadingText("Saving product changes...");
      const formData = new FormData();
      if (productEdit.title) formData.append("title", productEdit.title);
      if (productEdit.description)
        formData.append("description", productEdit.description);
      if (productEdit.price) formData.append("price", productEdit.price);
      if (productImgFile) {
        formData.append("image", productImgFile);
      }
      await updateProduct(productEdit?.id || -1, formData, auth.token);
      setProducts((prev) => {
        const copy = [...prev];
        copy[productEditIndex] = productEdit;
        return copy;
      });
      openNotification(
        "topRight",
        "Product updated successfully",
        "",
        "success",
      );
      setProductEditIndex(undefined);
      setProductEdit(undefined);
    } catch (error) {
      openNotification("topRight", "Failed to update product", "", "error");
    } finally {
      setLoading(false);
      setLoadingText("");
    }
  };
  useEffect(() => {
    if (id && auth?.token) {
      fetchProducts();
    }
  }, [id, auth?.token]);

  const handleDeleteProduct = async (productId: string) => {
    try {
      setLoading(true);
      setLoadingText("Deleting product...");
      await deleteProduct(Number(productId), auth.token);
      openNotification(
        "topRight",
        "Product deleted successfully",
        "",
        "success",
      );
      fetchProducts?.();
    } catch (err: any) {
      openNotification(
        "topRight",
        "Error deleting product",
        err?.message || "Something went wrong",
        "error",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {showProductForm && (
        <div className="w-full flex justify-end gap-2 mb-4">
          <button
            onClick={() => {
              setShowProductForm(false);
              setNewProductForm({
                title: "",
                price: "",
                description: "",
                image: null,
                id: 0,
              });
              setProductImgFile(null);
            }}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-100 transition text-sm"
          >
            Cancel
          </button>
          <button
            onClick={handleSaveNewProduct}
            className="px-4 py-2 bg-black text-white rounded-md hover:bg-gray-900 transition text-sm"
          >
            Save Product
          </button>
        </div>
      )}

      {!showProductForm && (
        <div className="w-full flex justify-end mb-4">
          <button
            onClick={() => setShowProductForm(true)}
            className="flex items-center gap-2 px-4 py-2 bg-black text-white rounded-md hover:bg-gray-900 transition text-sm"
          >
            <Plus size={16} />
            Add Product
          </button>
        </div>
      )}

      {showProductForm ? (
        <div className="w-full border border-gray-200 rounded-xl p-4 space-y-4">
          <div>
            <label className="block text-sm text-gray-700 mb-1">
              Product Name
            </label>
            <input
              type="text"
              name="title"
              value={newProductForm.title}
              onChange={handleNewProductFormChange}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black text-sm"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-700 mb-1">
              Description
            </label>
            <textarea
              name="description"
              value={newProductForm.description}
              onChange={handleNewProductFormChange}
              className="w-full border border-gray-300 rounded-md px-3 py-2 h-24 resize-none focus:outline-none focus:ring-2 focus:ring-black text-sm"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-700 mb-1">
              Price (₦)
            </label>
            <input
              type="text"
              name="price"
              value={newProductForm.price}
              onChange={handleNewProductFormChange}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black text-sm"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-700 mb-1">
              Product Image
            </label>
            <input
              type="file"
              accept="image/*"
              name="image"
              onChange={handleProductFileChange}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
            />
            {productImgFile && (
              <img
                src={URL.createObjectURL(productImgFile)}
                alt="Product Preview"
                className="mt-2 h-24 w-24 object-cover rounded-md"
              />
            )}
          </div>
        </div>
      ) : (
        <ContentHOC
          loading={productLoading}
          loadingText={"Fetching user Products"}
          error={!!productErr}
          errMessage={productErr || ""}
          noContent={products.length == 0}
          actionFn={fetchProducts}
          minHScreen={false}
          UIComponent={
            <div className="space-y-6 mt-6">
              {products.map((product, index) => {
                const isEditing = productEditIndex === index;
                if (isEditing) {
                  return (
                    <div
                      key={index}
                      className="p-6 rounded-lg bg-white relative shadow-md border border-gray-100"
                    >
                      <h3 className="text-xl font-bold text-gray-900 mb-6 pb-4 border-b border-gray-100">
                        Edit Product Details
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
                        <div>
                          <label
                            htmlFor="product-name"
                            className="block text-gray-600 text-sm font-medium mb-1"
                          >
                            Product Name
                          </label>
                          <input
                            id="product-name"
                            placeholder="e.g., Handcrafted Leather Wallet"
                            className="px-4 py-2 border border-gray-200 rounded-md w-full text-gray-800 focus:outline-none focus:ring-1 focus:ring-royalblue-500 focus:border-royalblue-500 transition-colors"
                            value={productEdit?.title || ""}
                            onChange={(e) =>
                              setProductEdit((prev) => ({
                                ...prev!,
                                title: e.target.value,
                              }))
                            }
                          />
                        </div>
                        <div>
                          <label
                            htmlFor="product-price"
                            className="block text-gray-600 text-sm font-medium mb-1"
                          >
                            Price (e.g., ₦15,000)
                          </label>
                          <input
                            id="product-price"
                            type="number"
                            placeholder="e.g., ₦15,000"
                            className="px-4 py-2 border border-gray-200 rounded-md w-full text-gray-800 focus:outline-none focus:ring-1 focus:ring-royalblue-500 focus:border-royalblue-500 transition-colors"
                            value={productEdit?.price || ""}
                            onChange={(e) =>
                              setProductEdit((prev) => ({
                                ...prev!,
                                price: e.target.value,
                              }))
                            }
                          />
                        </div>

                        <div>
                          <label
                            htmlFor="product-image"
                            className="block text-gray-600 text-sm font-medium mb-1"
                          >
                            Product Image
                          </label>
                          <input
                            id="product-image"
                            type="file"
                            accept="image/*"
                            name="image"
                            onChange={handleProductFileChange}
                            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                          />
                          {productImgFile && (
                            <img
                              src={URL.createObjectURL(productImgFile)}
                              alt="Product Preview"
                              className="mt-2 h-24 w-24 object-cover rounded-md"
                            />
                          )}
                          {productEdit?.image && !productImgFile && (
                            <img
                              src={undefined}
                              alt="Current Product"
                              className="mt-2 h-24 w-24 object-cover rounded-md"
                            />
                          )}
                        </div>
                      </div>
                      <div className="mt-5">
                        <label
                          htmlFor="product-description"
                          className="block text-gray-600 text-sm font-medium mb-1"
                        >
                          Product Description
                        </label>
                        <textarea
                          id="product-description"
                          placeholder="Provide a detailed description of the product..."
                          className="px-4 py-2 border border-gray-200 rounded-md w-full text-gray-800 focus:outline-none focus:ring-1 focus:ring-royalblue-500 focus:border-royalblue-500 transition-colors resize-y"
                          rows={4}
                          value={productEdit?.description || ""}
                          onChange={(e) =>
                            setProductEdit((prev) => ({
                              ...prev!,
                              description: e.target.value,
                            }))
                          }
                        />
                      </div>
                      <div className="flex justify-end gap-3 mt-8 pt-6 border-t border-gray-100">
                        <button
                          className="px-5 cursor-pointer py-2.5 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors duration-200 font-medium"
                          onClick={() => {
                            setProductEditIndex(undefined);
                            setProductEdit(undefined);
                          }}
                        >
                          Cancel
                        </button>
                        <button
                          className="px-5 py-2.5 bg-royalblue-main cursor-pointer text-white rounded-md hover:bg-royalblue-shade1 transition-colors duration-200 font-medium"
                          onClick={saveEditedProduct}
                        >
                          Save Changes
                        </button>
                      </div>
                    </div>
                  );
                }
                return (
                  <ProductServiceCard
                    handleDeleteProduct={handleDeleteProduct}
                    product={product}
                    key={index}
                    index={index}
                    setProductEdit={setProductEdit}
                    setProductEditIndex={setProductEditIndex}
                  />
                );
              })}
            </div>
          }
        />
      )}
    </div>
  );
}
