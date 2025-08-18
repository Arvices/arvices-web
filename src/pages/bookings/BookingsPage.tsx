import React, { useEffect, useState } from "react";
import {
  Button,
  Card,
  Spin,
  Tabs,
  message,
  Popconfirm,
} from "antd";
import { CheckCircleOutlined, DeleteOutlined } from "@ant-design/icons";
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
  serviceId?: number[];
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

  useEffect(() => {
    refreshData();
  }, [tab, status]);

  const refreshData = () => {
    if (tab === "bookings") {
      fetchBookings();
    } else {
      fetchOrders();
    }
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
      const newData = res.data.response.map((b: any) => ({
        id: b.id,
        name: b.clientName || `Booking #${b.id}`,
        status: b.status,
        price: b.price,
        date: b.createdDate,
        serviceId: b.serviceId || [],
        type: "booking" as const,
      }));
      setBookings(newData);
    } catch {
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
      const newData = res.data.response.map((o: any) => ({
        id: o.id,
        name: o.product?.title || "Order",
        status: o.status,
        price: o.product?.price,
        date: o.createdDate,
        type: "order" as const,
      }));
      setOrders(newData);
    } catch {
      message.error("Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  // -------- PAY ----------
  const handlePay = async (item: Booking, method: "Wallet" | "Non Wallet") => {
    try {
      const payload = {
        serviceRequestId: 0,
        method,
        orderId: item.type === "order" ? item.id : 0,
        bookingId: item.type === "booking" ? item.id : 0,
      };

      const res = await api.post(
        "/wallet/initialize-service-request-transaction",
        payload,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        }
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
      refreshData();
    } catch (err: any) {
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
          serviceId: item.serviceId ?? [],
          status: "Completed",
        }
      );
      message.success(
        `${item.type === "booking" ? "Booking" : "Order"} marked completed`
      );
      setStatus("Completed");
      refreshData();
    } catch (err: any) {
      message.error(err.response?.data?.message || "Failed to complete");
    }
  };

  // -------- DELETE ----------
  const handleDelete = async (item: Booking) => {
    try {
      await api.delete(
        item.type === "booking"
          ? `/bookings/deletebooking/${item.id}`
          : `/order/deleteorder/${item.id}`
      );
      message.success("Deleted successfully");
      refreshData();
    } catch (err: any) {
      message.error(err.response?.data?.message || "Failed to delete");
    }
  };

  const renderCard = (item: Booking) => (
    <Card
      key={item.id}
      title={`${item.type === "booking" ? "Booking" : "Order"} #${item.id}`}
      className="mb-4 shadow-md rounded-lg"
      extra={<span className="font-semibold">{item.status}</span>}
    >
      <p className="mb-1">{item.name}</p>
      <p className="mb-1">₦{item.price}</p>
      <p className="mb-2">
        {item.date ? dayjs(item.date).format("YYYY-MM-DD") : "N/A"}
      </p>

      {/* In Progress actions */}
      {auth.isClient && item.status === "In Progress" && (
        <div className="space-x-2">
          <Button
            type="primary"
            onClick={() => handlePay(item, "Wallet")}
            className="mb-2"
          >
            Pay with Wallet
          </Button>
          <Button onClick={() => handlePay(item, "Non Wallet")}>
            Pay Online
          </Button>
          <Popconfirm
            title="Delete this item?"
            onConfirm={() => handleDelete(item)}
          >
            <Button danger icon={<DeleteOutlined />} className="ml-2">
              Delete
            </Button>
          </Popconfirm>
        </div>
      )}

      {/* Paid actions */}
      {auth.isProvider && item.status === "Paid" && (
        <Button
          type="primary"
          icon={<CheckCircleOutlined />}
          onClick={() => handleComplete(item)}
        >
          Mark Completed
        </Button>
      )}
    </Card>
  );

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Bookings & Orders</h1>
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

      {tab === "bookings"
        ? bookings.map((item) => renderCard(item))
        : orders.map((item) => renderCard(item))}

      {/* ---------- CREATE FLOW START (commented out) ----------
      // const [showCreateModal, setShowCreateModal] = useState(false);
      // const [showOrderModal, setShowOrderModal] = useState(false);
      // const [newName, setNewName] = useState("");
      // const [newDate, setNewDate] = useState<string | null>(null);
      // const [categories, setCategories] = useState<Category[]>([]);
      // const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
      // const [professionals, setProfessionals] = useState<Professional[]>([]);
      // const [selectedProfessionalId, setSelectedProfessionalId] = useState<number | null>(null);
      // const [creatingBooking, setCreatingBooking] = useState(false);
      // const [products, setProducts] = useState<Product[]>([]);
      // const [selectedProductId, setSelectedProductId] = useState<number | null>(null);
      // const [quantity, setQuantity] = useState<number>(1);
      // const [creatingOrder, setCreatingOrder] = useState(false);

      // async function fetchCategories() {...}
      // async function fetchProfessionals() {...}
      // async function fetchProducts() {...}
      // async function handleCreateBooking() {...}
      // async function handleCreateOrder() {...}

      // Floating Add Button
      // <Button
      //   type="primary"
      //   shape="circle"
      //   icon={<PlusOutlined />}
      //   className="!fixed bottom-1/2 right-6 shadow-lg"
      //   onClick={() =>
      //     tab === "bookings"
      //       ? setShowCreateModal(true)
      //       : setShowOrderModal(true)
      //   }
      // />

      // Create Booking Modal ...
      // Create Order Modal ...
      ---------- CREATE FLOW END ---------- */}
    </div>
  );
};

export default BookingsPage;
