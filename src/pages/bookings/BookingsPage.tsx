import React, { useEffect, useState } from "react";
import { Button, Card, Spin, Tabs, Popconfirm, message } from "antd";
import { DeleteOutlined } from "@ant-design/icons";
import { useAuth } from "../../contexts/AuthContext";
import api from "../../util/api";
import dayjs from "dayjs";

interface Booking {
  id: number;
  name?: string;
  status: string;
  price?: number;
  type: "booking" | "order";
  date?: string;
  totalCost?: number | null;
  totalDuration?: number | null;
  bookingDate?: string | null;
  clientName?: string | null;
  services?: string[];
}

const BookingsPage: React.FC = () => {
  const auth = useAuth();

  const [tab, setTab] = useState<"bookings" | "orders">("bookings");
  const [status, setStatus] = useState<"In Progress" | "Paid" | "Completed">(
    "In Progress"
  );

  const [bookings, setBookings] = useState<Booking[]>([]);
  const [orders, setOrders] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(false);

  const [deletingBookingId, setDeletingBookingId] = useState<number | null>(
    null
  );
  const [deletingOrderId, setDeletingOrderId] = useState<number | null>(null);

  useEffect(() => {
    refreshData();
  }, [tab, status]);

  const refreshData = () => {
    if (tab === "bookings") fetchBookings();
    else fetchOrders();
  };

  // -------- Fetch Bookings ----------
  const fetchBookings = async () => {
    setLoading(true);
    try {
      const res = await api.get(
        `/bookings/getallbookings?status=${encodeURIComponent(
          status
        )}&orderBy=DESC&page=1&limit=10`
      );
      const newData = (res.data.response || []).map((b: any) => ({
        id: b.id,
        name: b.clientName || `Booking #${b.id}`,
        status: b.status,
        price: b.price,
        date: b.createdDate,
        totalCost: b.totalCost,
        totalDuration: b.totalDuration,
        bookingDate: b.bookingDate,
        clientName: b.clientName,
        services: (b.service || []).map((s: any) => s.title),
        type: "booking" as const,
      }));
      setBookings(newData);
    } catch (err) {
      console.error(err);
      message.error("Failed to load bookings");
    } finally {
      setLoading(false);
    }
  };

  // -------- Fetch Orders ----------
  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await api.get(
        `/order/getallorder?status=${encodeURIComponent(
          status
        )}&orderBy=DESC&page=1&limit=10`
      );
      const newData = (res.data.response || []).map((o: any) => ({
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

  // -------- PAY ----------
  const handlePay = async (item: Booking, method: "Wallet" | "Non Wallet") => {
    try {
      // 🔎 Step 1: Fetch the real servicerequestId
      let servicerequestId = 0;

      try {
        const res = await api.get(
          `/servicerequest/getbybookingid/${item.id}`
        );
        servicerequestId = res.data?.response?.id ?? 0;
        console.log("✅ Got servicerequestId:", servicerequestId);
      } catch (err) {
        console.error("❌ Failed to fetch servicerequestId:", err);
        message.error("Could not find service request for this booking.");
        return;
      }

      if (!servicerequestId) {
        message.error("No service request found for this booking.");
        return;
      }

      // 📝 Step 2: Build payload correctly
      const payload = {
        servicerequestId,
        method,
        orderId: item.type === "order" ? item.id : 0,
        bookingId: item.type === "booking" ? item.id : 0,
      };

      console.log("📦 Sending payment payload:", payload);

      // 🚀 Step 3: Call API
      const res = await api.post(
        "/wallet/initialize-service-request-transaction",
        payload
      );
      console.log("✅ Raw payment response:", res);

      // 🌍 Step 4: Handle redirect if Non Wallet
      if (method === "Non Wallet") {
        const url = res.data?.response?.data?.authorization_url;
        if (url) {
          console.log("🌍 Opening payment URL:", url);
          window.open(url, "_blank");
          return;
        } else {
          message.error("No payment URL returned from server.");
        }
      } else {
        message.success("Payment successful!");
        setStatus("Paid");
      }
    } catch (err: any) {
      console.error("❌ Pay failed:", err.response || err);
      message.error(err.response?.data?.message || "Payment failed");
    }
  };

  // -------- COMPLETE ----------
  const handleComplete = async (item: Booking) => {
    try {
      await api.put(
        item.type === "booking"
          ? `/bookings/updatebookings/${item.id}`
          : `/order/updateorder/${item.id}`,
        {
          name: item.name ?? "Item",
          date: item.date ?? new Date().toISOString(),
          status: "Completed",
        }
      );
      message.success(
        `${item.type === "booking" ? "Booking" : "Order"} completed!`
      );
      setStatus("Completed");
    } catch (err: any) {
      console.error("Complete failed:", err);
      message.error("Failed to complete.");
    }
  };

  // -------- DELETE ----------
  const handleDeleteBooking = async (id: number) => {
    try {
      setDeletingBookingId(id);
      console.log("🗑️ Attempting to delete booking:", id);

      const res = await api.delete(`/bookings/deletebookings/${id}`);
      console.log("✅ Booking delete response:", res.status, res.data);

      if (res.status >= 200 && res.status < 300) {
        setBookings((prev) => prev.filter((b) => b.id !== id));
        message.success("Booking deleted!");
      } else {
        message.error("Failed to delete booking.");
      }
    } catch (err: any) {
      console.error("❌ Delete booking failed:", err.response || err);
      message.error(
        err.response?.data?.message || "Failed to delete booking."
      );
    } finally {
      setDeletingBookingId(null);
    }
  };

  const handleDeleteOrder = async (id: number) => {
    try {
      setDeletingOrderId(id);
      console.log("🗑️ Attempting to delete order:", id);

      const res = await api.delete(`/order/deleteorder/${id}`);
      console.log("✅ Order delete response:", res.status, res.data);

      if (res.status >= 200 && res.status < 300) {
        setOrders((prev) => prev.filter((o) => o.id !== id));
        message.success("Order deleted!");
      } else {
        message.error("Failed to delete order.");
      }
    } catch (err: any) {
      console.error("❌ Delete order failed:", err.response || err);
      message.error(err.response?.data?.message || "Failed to delete order.");
    } finally {
      setDeletingOrderId(null);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 relative">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-bold">Bookings & Orders</h1>
        <Button onClick={refreshData}>🔄 Refresh</Button>
      </div>

      {/* Tabs for Bookings vs Orders */}
      <Tabs
        activeKey={tab}
        onChange={(key) => setTab(key as "bookings" | "orders")}
        items={[
          { key: "bookings", label: "Bookings" },
          { key: "orders", label: "Orders" },
        ]}
      />

      {/* Status Tabs */}
      <Tabs
        activeKey={status}
        onChange={(key) =>
          setStatus(key as "In Progress" | "Paid" | "Completed")
        }
        items={[
          { key: "In Progress", label: "In Progress" },
          { key: "Paid", label: "Paid" },
          { key: "Completed", label: "Completed" },
        ]}
      />

      {loading && <Spin className="my-4" />}

      {/* Bookings List */}
      {tab === "bookings" &&
        bookings.map((item) => (
          <Card key={item.id} className="mb-4">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-semibold">Booking #{item.id}</h3>
                <p>
                  <strong>Client:</strong> {item.clientName || "N/A"}
                </p>
                <p>
                  <strong>Status:</strong> {item.status}
                </p>
                <p>
                  <strong>Total Cost:</strong> ₦{item.totalCost ?? 0}
                </p>
                <p>
                  <strong>Total Duration:</strong> {item.totalDuration ?? 0} hrs
                </p>
                <p>
                  <strong>Booking Date:</strong>{" "}
                  {item.bookingDate
                    ? dayjs(item.bookingDate).format("YYYY-MM-DD")
                    : "N/A"}
                </p>
                <p>
                  <strong>Created Date:</strong>{" "}
                  {item.date
                    ? dayjs(item.date).format("YYYY-MM-DD")
                    : "N/A"}
                </p>
                {item.services && item.services.length > 0 && (
                  <p>
                    <strong>Services:</strong> {item.services.join(", ")}
                  </p>
                )}
              </div>

              {item.status === "In Progress" && (
                <Popconfirm
                  title="Delete this booking?"
                  description="This action cannot be undone."
                  okText="Yes, Delete"
                  cancelText="Cancel"
                  onConfirm={() => handleDeleteBooking(item.id)}
                >
                  <Button
                    type="text"
                    danger
                    icon={<DeleteOutlined />}
                    loading={deletingBookingId === item.id}
                  />
                </Popconfirm>
              )}
            </div>

            {auth.isClient && item.status === "In Progress" && (
              <>
                <Button
                  type="primary"
                  onClick={() => handlePay(item, "Wallet")}
                  className="mr-2"
                >
                  Pay with Wallet
                </Button>
                <Button onClick={() => handlePay(item, "Non Wallet")}>
                  Pay Online
                </Button>
              </>
            )}

            {auth.isProvider && item.status === "Paid" && (
              <Button type="primary" onClick={() => handleComplete(item)}>
                Complete Booking
              </Button>
            )}
          </Card>
        ))}

      {/* Orders List */}
      {tab === "orders" &&
        orders.map((item) => (
          <Card key={item.id} className="mb-4">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-semibold">Order #{item.id}</h3>
                <p>{item.name}</p>
                <p>Status: {item.status}</p>
                <p>Price: ₦{item.price}</p>
                <p>
                  Date:{" "}
                  {item.date ? dayjs(item.date).format("YYYY-MM-DD") : "N/A"}
                </p>
              </div>

              {item.status === "In Progress" && (
                <Popconfirm
                  title="Delete this order?"
                  description="This action cannot be undone."
                  okText="Yes, Delete"
                  cancelText="Cancel"
                  onConfirm={() => handleDeleteOrder(item.id)}
                >
                  <Button
                    type="text"
                    danger
                    icon={<DeleteOutlined />}
                    loading={deletingOrderId === item.id}
                  />
                </Popconfirm>
              )}
            </div>

            {auth.isClient && item.status === "In Progress" && (
              <>
                <Button
                  type="primary"
                  onClick={() => handlePay(item, "Wallet")}
                  className="mr-2"
                >
                  Pay with Wallet
                </Button>
                <Button onClick={() => handlePay(item, "Non Wallet")}>
                  Pay Online
                </Button>
              </>
            )}

            {auth.isProvider && item.status === "Paid" && (
              <Button type="primary" onClick={() => handleComplete(item)}>
                Complete Order
              </Button>
            )}
          </Card>
        ))}
    </div>
  );
};

export default BookingsPage;
