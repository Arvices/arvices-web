import React, { useEffect, useState } from "react";
import { message, Spin } from "antd";
import { useAuth } from "../../contexts/AuthContext";
import api from "../../util/api";
import dayjs from "dayjs";
import { NoContent } from "../../components/nocontent";
import { useNotificationContext } from "../../contexts/NotificationContext";
import { parseHttpError } from "../../api-services/parseReqError";
interface Booking {
  id: number;
  name?: string;
  status: string;
  price?: number;
  type: "booking" | "order";
  date?: string;
  serviceId?: number[];
}
const BookingsPage: React.FC = () => {
  const auth = useAuth();
  const { openNotification } = useNotificationContext();
  const [tab, setTab] = useState<"bookings" | "orders">("bookings");
  const [status, setStatus] = useState<"In Progress" | "Paid" | "Completed">(
    "In Progress",
  );
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [orders, setOrders] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(false);

  const refreshData = () => {
    if (tab === "bookings") {
      fetchBookings();
    } else {
      fetchOrders();
    }
  };
  useEffect(() => {
    refreshData();
  }, [status, tab]);
  const fetchBookings = async () => {
    setLoading(true);
    try {
      const res = await api.get(
        `/bookings/getallbookings?status=${encodeURIComponent(status)}`,
      );
      const newData = res.data.response.map((b: any) => ({
        id: b.id,
        name: b.name,
        status: b.status,
        price: b.price,
        date: b.date,
        serviceId: b.serviceId || [],
        type: "booking" as const,
      }));
      setBookings(newData);
    } catch (err) {
      console.error(err);
      let message = parseHttpError(err);
      openNotification("topRight", "Failed", message, "error");
    } finally {
      setLoading(false);
    }
  };
  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await api.get(
        `/order/getallorder?status=${encodeURIComponent(status)}&orderBy=DESC&page=1&limit=10`,
      );
      const newData = res.data.response.map((o: any) => ({
        id: o.id,
        name: o.product?.title || "Order",
        status: o.status,
        price: o.product?.price,
        date: o.createdDate,
        type: "order" as const,
      }));
      setOrders(newData);
    } catch (err) {
      console.error(err);
      message.error("Failed to load orders");
    } finally {
      setLoading(false);
    }
  };
  const handlePay = async (item: Booking, method: "Wallet" | "Non Wallet") => {
    try {
      const payload = {
        serviceRequestId: 0,
        method,
        orderId: item.type === "order" ? item.id : 0,
        bookingId: item.type === "booking" ? item.id : 0,
      };
      console.log("📦 Sending payload:", payload);
      const res = await api.post(
        "/wallet/initialize-service-request-transaction",
        payload,
        {
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        },
      );
      console.log("✅ Payment response:", res.data);
      openNotification(
        "topRight",
        "Successful",
        "Payment Successful",
        "success",
      );
      if (method === "Non Wallet") {
        const url = res.data?.response?.data?.authorization_url;
        if (url) {
          window.open(url, "_blank");
          return;
        }
      }
      message.success("Payment successful!");
      setStatus("Paid");
    } catch (err: any) {
      console.error("❌ Pay failed (full error):", err);
      let message = parseHttpError(err);
      openNotification("topRight", "Failed", message, "error");
    }
  };
  const handleComplete = async (item: Booking) => {
    try {
      await api.put(
        item.type === "booking"
          ? `/bookings/updatebookings/${item.id}`
          : `/order/updateorder/${item.id}`,
        {
          name: item.name ?? "Item",
          date: item.date ?? new Date().toISOString(),
          serviceId: item.serviceId ?? [],
          status: "Completed",
        },
      );

      const successMsg = `${item.type === "booking" ? "Booking" : "Order"} completed!`;
      message.success(successMsg);
      openNotification("topRight", "Successful", successMsg, "success");

      setStatus("Completed");
    } catch (err: any) {
      console.error("❌ Complete failed:", err);
      const errorMsg = err.response?.data?.message || "Failed to complete.";
      message.error(errorMsg);
      openNotification("topRight", "Failed", errorMsg, "error");
    }
  };
  return (
    <section className="min-h-screen pt-13 ">
      <div className="px-5 sm:px-8 md:px-16 lg:px-25 max-w-[1280px] mx-auto">
        <div className="w-full mx-auto p-6 relative bg-white">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-xl font-semibold text-gray-800">
              Bookings & Orders
            </h1>
            <button
              onClick={refreshData}
              className="px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 transition"
            >
              Refresh
            </button>
          </div>

          {/* Main Tabs (Bookings / Orders) */}
          <div className="mb-2 border-b border-gray-200">
            <div className="flex w-full">
              {["bookings", "orders"].map((key) => (
                <button
                  key={key}
                  onClick={() => setTab(key as "bookings" | "orders")}
                  className={`flex-1 py-2 text-center text-sm font-medium transition-colors rounded-t-md
          ${
            tab === key
              ? "bg-gray-100 text-gray-900"
              : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
          }`}
                >
                  {key.charAt(0).toUpperCase() + key.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Sub Tabs (Status) */}
          <div className="mb-4 flex justify-center gap-4">
            {["In Progress", "Paid", "Completed"].map((key) => (
              <button
                key={key}
                onClick={() =>
                  setStatus(key as "In Progress" | "Paid" | "Completed")
                }
                className={`px-3 py-1 text-sm rounded-md transition-colors
        ${
          status === key
            ? "bg-blue-200 text-blue-900"
            : "text-blue-500 hover:text-blue-700 hover:bg-blue-50"
        }`}
              >
                {key}
              </button>
            ))}
          </div>

          {loading && <Spin size="small" className="my-6" />}

          {/* Bookings */}
          {tab === "bookings" &&
            bookings.map((item) => (
              <div
                key={item.id}
                className="mb-4 p-4 border border-gray-200 rounded-xl shadow-sm bg-gray-50"
              >
                <h3 className="font-semibold text-gray-800">
                  Booking #{item.id}
                </h3>
                <p className="text-gray-600">{item.name}</p>
                <p className="text-sm text-gray-500">Status: {item.status}</p>
                <p className="text-sm text-gray-500">Price: ₦{item.price}</p>
                <p className="text-sm text-gray-500">
                  Date:{" "}
                  {item.date ? dayjs(item.date).format("YYYY-MM-DD") : "N/A"}
                </p>

                {auth.isClient && item.status === "In Progress" && (
                  <div className="mt-3 flex gap-2">
                    <button
                      onClick={() => handlePay(item, "Wallet")}
                      className="px-4 py-2 rounded-lg bg-gray-800 text-white hover:bg-gray-700 transition"
                    >
                      Pay with Wallet
                    </button>
                    <button
                      onClick={() => handlePay(item, "Non Wallet")}
                      className="px-4 py-2 rounded-lg border border-gray-300 bg-white hover:bg-gray-100 text-gray-700 transition"
                    >
                      Pay Online
                    </button>
                  </div>
                )}

                {auth.isProvider && item.status === "Paid" && (
                  <button
                    onClick={() => handleComplete(item)}
                    className="mt-3 px-4 py-2 rounded-lg bg-gray-800 text-white hover:bg-gray-700 transition"
                  >
                    Complete Booking
                  </button>
                )}
              </div>
            ))}

          {tab === "bookings" && bookings.length === 0 && (
            <NoContent
              message={`You do not have any ${status}  bookings at the moment`}
            />
          )}
          {tab === "orders" && orders.length === 0 && (
            <NoContent
              message={`You do not have any ${status} orders at the moment`}
            />
          )}

          {/* Orders */}
          {tab === "orders" &&
            orders.map((item) => (
              <div
                key={item.id}
                className="mb-4 p-4 border border-gray-200 rounded-xl shadow-sm bg-gray-50"
              >
                <h3 className="font-semibold text-gray-800">
                  Order #{item.id}
                </h3>
                <p className="text-gray-600">{item.name}</p>
                <p className="text-sm text-gray-500">Status: {item.status}</p>
                <p className="text-sm text-gray-500">Price: ₦{item.price}</p>
                <p className="text-sm text-gray-500">
                  Date:{" "}
                  {item.date ? dayjs(item.date).format("YYYY-MM-DD") : "N/A"}
                </p>

                {auth.isClient && item.status === "In Progress" && (
                  <div className="mt-3 flex gap-2">
                    <button
                      onClick={() => handlePay(item, "Wallet")}
                      className="px-4 py-2 rounded-lg bg-gray-800 text-white hover:bg-gray-700 transition"
                    >
                      Pay with Wallet
                    </button>
                    <button
                      onClick={() => handlePay(item, "Non Wallet")}
                      className="px-4 py-2 rounded-lg border border-gray-300 bg-white hover:bg-gray-100 text-gray-700 transition"
                    >
                      Pay Online
                    </button>
                  </div>
                )}

                {auth.isProvider && item.status === "Paid" && (
                  <button
                    onClick={() => handleComplete(item)}
                    className="mt-3 px-4 py-2 rounded-lg bg-gray-800 text-white hover:bg-gray-700 transition"
                  >
                    Complete Order
                  </button>
                )}
              </div>
            ))}
        </div>
      </div>
    </section>
  );
};
export default BookingsPage;
