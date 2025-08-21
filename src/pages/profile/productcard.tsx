import { ShoppingBag } from "lucide-react";
import React, { useState } from "react";
import { ProductPayload } from "./manageproduct";
import { useAuth } from "../../contexts/AuthContext";
import { useLoading } from "../../contexts/LoadingContext";
import { useNotificationContext } from "../../contexts/NotificationContext";
import { createOrder } from "../../api-services/orders.service";

interface ProductCardProp {
  product: ProductPayload;
  index: number;
}

const themeArray = ["blue", "green", "yellow", "red", "purple"];

function getThemeByIndex(index: number) {
  const actualIndex = index % themeArray.length;
  return themeArray[actualIndex];
}
const ProductCardProfile: React.FC<ProductCardProp> = ({ product, index }) => {
  const theme = getThemeByIndex(index); // This can be changed dynamically based on props or context

  const [quantity, setQuantity] = useState(1);

  const auth = useAuth();
  const { setLoading, setLoadingText } = useLoading();
  const notify = useNotificationContext();

  const handlePlaceOrder = async () => {
    try {
      setLoading(true);
      setLoadingText("Placing your order...");

      const payload = {
        quantity,
        productId: product.id,
      };

      const response = await createOrder(payload, auth.token);

      notify.openNotification(
        "topRight",
        "Success",
        "Order placed successfully!",
        "success",
      );

      console.log("Order response:", response.data);
    } catch (error: any) {
      console.error("Error placing order:", error);
      notify.openNotification(
        "topRight",
        "Error",
        "Failed to place the order. Please try again.",
        "error",
      );
    } finally {
      setLoading(false);
      setLoadingText("");
    }
  };

  return (
    <div
      className={`w-full rounded-[10px] bg-${theme}-50 p-4 border-${theme}-100`}
    >
      <div className={`bg-50`}>
        {/* Placeholder for the product image */}
        <div
          className={`bg-gray-50 border border-gray-100 h-50 rounded-[10px] overflow-hidden`}
        >
          <img
            src={product?.images[0]?.path || undefined}
            alt={product?.title}
            className="w-full h-full object-cover"
          />
        </div>
      </div>
      <div className="py-4" />
      <div>
        <h6
          className={`text-${theme}-900 text-[18px] font-semibold tracking-tight`}
        >
          {product?.title}
        </h6>
        <p className={`text-${theme}-800 text-[14px]`}>{product.description}</p>
        <p className={`text-${theme}-800 text-[14px] font-semibold`}>Price - NGN {product.price}</p>
      </div>
      {auth.isClient && (
        <div>
          <div className="py-4" />
          <div>
            <button
              onClick={() => {
                setQuantity((prev) => {
                  let next = prev - 1;
                  // Corrected logic: if next is less than 0, return 0; otherwise, return next.
                  return next < 0 ? 0 : next;
                });
              }}
              className={`w-10 h-10 rounded-full bg-${theme}-500 cursor-pointer text-white`}
            >
              -
            </button>
            <span className="inline-block px-3">{quantity}</span>
            <button
              onClick={() => {
                setQuantity((prev) => prev + 1);
              }}
              className={`w-10 h-10 rounded-full bg-${theme}-500 cursor-pointer text-white`}
            >
              +
            </button>
          </div>
          <div className="py-4" />
          <div>
            <button
              onClick={handlePlaceOrder}
              className={`cursor-pointer p-2 pl-5 w-full rounded-full bg-${theme}-500 text-white flex items-center justify-between`}
            >
              <span className="font-medium tracking-tight">
                Place Order For This Item
              </span>
              <span
                className={`bg-white text-${theme}-600 rounded-full inline-block p-3`}
              >
                <ShoppingBag className={` w-5 h-5`} />
              </span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductCardProfile;
