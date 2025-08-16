import React, { useEffect, useState } from "react";
import {
  Button,
  Card,
  Spin,
  Tabs,
  Modal,
  Input,
  DatePicker,
  Select,
  List,
  message,
} from "antd";
import { PlusOutlined, CheckCircleOutlined } from "@ant-design/icons";
import { useAuth } from "../../contexts/AuthContext";
import api from "../../util/api";
import dayjs, { Dayjs } from "dayjs";

interface Booking {
  id: number;
  name?: string;
  status: string;
  price?: number;
  type: "booking" | "order";
  date?: string;
  serviceId?: number[];
}

interface Category {
  id: number;
  name: string;
}

interface Professional {
  id: number;
  fullName: string;
  email: string;
  picture?: string | null;
}

interface Product {
  id: number;
  title: string;
  price: number;
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

  // Booking modal state
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newName, setNewName] = useState("");
  const [newDate, setNewDate] = useState<string | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [professionals, setProfessionals] = useState<Professional[]>([]);
  const [selectedProfessionalId, setSelectedProfessionalId] = useState<
    number | null
  >(null);
  const [creatingBooking, setCreatingBooking] = useState(false);

  // Order modal state
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProductId, setSelectedProductId] = useState<number | null>(
    null
  );
  const [quantity, setQuantity] = useState<number>(1);
  const [creatingOrder, setCreatingOrder] = useState(false);

  useEffect(() => {
    refreshData();
    if (tab === "bookings") fetchCategories();
    if (tab === "orders") fetchProducts();
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
        `/bookings/getallbookings?status=${encodeURIComponent(status)}`
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
    } catch (err) {
      console.error(err);
      message.error("Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  // -------- Fetch Categories ----------
  const fetchCategories = async () => {
    try {
      const res = await api.get("/category/getallcategory");
      setCategories(res.data.response);
    } catch {
      message.error("Failed to load categories");
    }
  };

  // -------- Fetch Professionals ----------
  const fetchProfessionals = async (categoryId: number) => {
    try {
      const res = await api.get(
        `/user/getprofessionals?category=${categoryId}&orderBy=DESC&page=1&limit=10`
      );
      setProfessionals(res.data.response || []);
    } catch {
      message.error("Failed to load professionals");
    }
  };

  // -------- Fetch Products ----------
  const fetchProducts = async () => {
    try {
      const res = await api.get(
        "/product/getallproduct?orderBy=DESC&page=1&limit=10"
      );
      setProducts(res.data.response || []);
    } catch {
      message.error("Failed to load products");
    }
  };

  // -------- PAY ----------
  const handlePay = async (item: Booking, method: "Wallet" | "Non Wallet") => {
  try {
    // ✅ Corrected payload (camelCase like Swagger)
    const payload = {
      serviceRequestId: 0,
      method,
      orderId: item.type === "order" ? item.id : 0,
      bookingId: item.type === "booking" ? item.id : 0,
    };

    console.log("📦 Sending payload:", payload);

    const res = await api.post(
      "/wallet/initialize-service-request-transaction",
      payload, // axios will JSON.stringify automatically
      {
        headers: {
          Accept: "application/json",   // ✅ match Swagger
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      }
    );

    console.log("✅ Payment response:", res.data);

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
        `${item.type === "booking" ? "Booking" : "Order"} completed!`
      );
      setStatus("Completed");
    } catch (err: any) {
      console.error("Complete failed:", err);
      message.error(err.response?.data?.message || "Failed to complete.");
    }
  };

const handleCreateBooking = async () => {
  if (!newName.trim()) {
    message.warning("Please enter a booking name!");
    return;
  }
  if (!selectedCategory) {
    message.warning("Please select a category!");
    return;
  }

  setCreatingBooking(true);
  try {
    const payload = {
      name: newName,
      date: newDate || new Date().toISOString(),
      serviceId: [selectedCategory],
      ...(selectedProfessionalId && { professionalId: selectedProfessionalId }),
    };

    console.log("🔎 Final booking payload:", JSON.stringify(payload, null, 2));

    const res = await api.post("/bookings/createbookings", payload);

    console.log("✅ Booking created response:", res.data);

    message.success("Booking created!");
    setShowCreateModal(false);
    setNewName("");
    setNewDate(null);
    setSelectedCategory(null);
    setSelectedProfessionalId(null);
    setProfessionals([]);
    setStatus("In Progress");
    refreshData();
  } catch (err: any) {
    console.error("❌ Booking creation error object:", err);

    // Make sure we always show something
    const errorContent =
      err?.response?.data
        ? JSON.stringify(err.response.data, null, 2)
        : err?.message || "Unknown error (no response at all)";

    Modal.error({
      title: "Booking Creation Failed",
      content: (
        <pre style={{ whiteSpace: "pre-wrap" }}>{errorContent}</pre>
      ),
      width: 600,
    });

    message.error("Failed to create booking. Check modal for details.");
  } finally {
    setCreatingBooking(false);
  }
};



  // -------- CREATE Order ----------
  const handleCreateOrder = async () => {
    if (!selectedProductId) {
      message.warning("Please select a product!");
      return;
    }
    setCreatingOrder(true);
    try {
      const payload = {
        productId: selectedProductId,
        quantity,
      };

      console.log("Creating order with payload:", payload);

      await api.post("/order/createorder", payload);

      message.success("Order created!");
      setShowOrderModal(false);
      setSelectedProductId(null);
      setQuantity(1);
      setStatus("In Progress");
      refreshData();
    } catch (err: any) {
      console.error("Create order failed:", err);
      message.error(err.response?.data?.message || "Failed to create order.");
    } finally {
      setCreatingOrder(false);
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
      {tab === "bookings" &&
        bookings.map((item) => (
          <Card key={item.id} className="mb-4">
            <h3 className="font-semibold">Booking #{item.id}</h3>
            <p>{item.name}</p>
            <p>Status: {item.status}</p>
            <p>Price: ₦{item.price}</p>
            <p>
              Date:{" "}
              {item.date ? dayjs(item.date).format("YYYY-MM-DD") : "N/A"}
            </p>

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

      {tab === "orders" &&
        orders.map((item) => (
          <Card key={item.id} className="mb-4">
            <h3 className="font-semibold">Order #{item.id}</h3>
            <p>{item.name}</p>
            <p>Status: {item.status}</p>
            <p>Price: ₦{item.price}</p>
            <p>
              Date:{" "}
              {item.date ? dayjs(item.date).format("YYYY-MM-DD") : "N/A"}
            </p>

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

      {/* Floating Add Button */}
      <Button
        type="primary"
        shape="circle"
        icon={<PlusOutlined />}
        className="!fixed bottom-1/2 right-6 shadow-lg"
        onClick={() =>
          tab === "bookings"
            ? setShowCreateModal(true)
            : setShowOrderModal(true)
        }
      />

      {/* Create Booking Modal */}
<Modal
  title="Create Booking"
  open={showCreateModal}
  confirmLoading={creatingBooking}
  onCancel={() => setShowCreateModal(false)}
  onOk={handleCreateBooking}   // ✅ fires when "Create" is clicked
  okText="Create"              // button text
  cancelText="Cancel"
>
  <Input
    placeholder="Booking Name"
    value={newName}
    onChange={(e) => setNewName(e.target.value)}
    className="mb-2"
  />
  <DatePicker
    className="w-full mb-2"
    onChange={(date: Dayjs | null) =>
      setNewDate(date ? date.toISOString() : null)
    }
  />
  <Select
    placeholder="Select Category"
    className="w-full mb-2"
    value={selectedCategory ?? undefined}
    onChange={(val) => {
      setSelectedCategory(Number(val));
      fetchProfessionals(Number(val));
    }}
  >
    {categories.map((cat) => (
      <Select.Option key={cat.id} value={cat.id}>
        {cat.name}
      </Select.Option>
    ))}
  </Select>

  {professionals.length > 0 && (
    <>
      <p className="font-semibold mb-2">Professionals</p>
      <List
        bordered
        dataSource={professionals}
        renderItem={(pro) => (
          <List.Item
            className={`cursor-pointer ${
              selectedProfessionalId === pro.id ? "bg-blue-100" : ""
            }`}
            onClick={() => setSelectedProfessionalId(pro.id)}
          >
            <div className="flex items-center justify-between w-full">
              <div>
                <strong>{pro.fullName}</strong> <br />
                <small>{pro.email}</small>
              </div>
              {selectedProfessionalId === pro.id && (
                <CheckCircleOutlined style={{ color: "green" }} />
              )}
            </div>
          </List.Item>
        )}
      />
    </>
  )}
</Modal>


      {/* Create Order Modal */}
      <Modal
        title="Create Order"
        open={showOrderModal}
        confirmLoading={creatingOrder}
        onCancel={() => setShowOrderModal(false)}
        footer={[
          <Button key="cancel" onClick={() => setShowOrderModal(false)}>
            Cancel
          </Button>,
          <Button
            key="ok"
            type="primary"
            loading={creatingOrder}
            onClick={handleCreateOrder}
          >
            Create
          </Button>,
        ]}
      >
        <Select
          placeholder="Select Product"
          className="w-full mb-2"
          value={selectedProductId ?? undefined}
          onChange={(val) => setSelectedProductId(Number(val))}
        >
          {products.map((prod) => (
            <Select.Option key={prod.id} value={prod.id}>
              {prod.title} - ₦{prod.price}
            </Select.Option>
          ))}
        </Select>
        <Input
          type="number"
          min={1}
          placeholder="Quantity"
          value={quantity}
          onChange={(e) => setQuantity(Number(e.target.value))}
        />
      </Modal>
    </div>
  );
};

export default BookingsPage;
