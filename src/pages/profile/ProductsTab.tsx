import React, { useState, useEffect } from "react";
import { Button, Input, message, Spin, Card, Pagination } from "antd";
import axios from "axios";
import { useAuth } from "../../contexts/AuthContext";

interface Product {
  id: number;
  title: string;
  description: string;
  price: number;
  createdDate: string;
}

const ProductsTab: React.FC = () => {
  const { token, user } = useAuth();

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);

  const [newProduct, setNewProduct] = useState({
    title: "",
    description: "",
    price: "",
  });

  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [editProduct, setEditProduct] = useState<Product | null>(null);

  // Pagination state
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const limit = 10;

  // Fetch products belonging to logged in user
  const fetchProducts = async (currentPage = 1) => {
    if (!user?.id) return;
    try {
      setLoading(true);
      const res = await axios.get(
        `https://arvicesapi.denateonlineservice.com/product/getallproduct`,
        {
          params: {
            userId: user.id,
            orderBy: "DESC",
            page: currentPage,
            limit,
          },
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setProducts(res.data.response || []);
      setTotal(res.data.total || res.data.response?.length || 0); // fallback if API doesn’t return total
    } catch (err: any) {
      console.error("❌ Error fetching products:", err.response?.data || err);
      message.error("Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts(page);
  }, [page]);

  // Create new product
  const handleCreate = async () => {
    try {
      await axios.post(
        `https://arvicesapi.denateonlineservice.com/product/createproduct`,
        {
          title: newProduct.title,
          description: newProduct.description,
          price: Number(newProduct.price),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      message.success("✅ Product created successfully");
      setShowForm(false);
      setNewProduct({ title: "", description: "", price: "" });
      fetchProducts(page);
    } catch (err: any) {
      console.error("❌ Create product error:", err.response?.data || err);
      message.error("Failed to create product");
    }
  };

  // Delete product
  const handleDelete = async (id: number) => {
    try {
      await axios.delete(
        `https://arvicesapi.denateonlineservice.com/product/deleteproduct/${id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      message.success("🗑️ Product deleted");
      fetchProducts(page);
    } catch (err: any) {
      console.error("❌ Delete product error:", err.response?.data || err);
      message.error("Failed to delete product");
    }
  };

  // Save edited product
  const handleSaveEdit = async () => {
    if (!editProduct) return;
    try {
      await axios.put(
        `https://arvicesapi.denateonlineservice.com/product/updateproduct/${editProduct.id}`,
        {
          title: editProduct.title,
          description: editProduct.description,
          price: editProduct.price,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      message.success("✏️ Product updated");
      setEditIndex(null);
      setEditProduct(null);
      fetchProducts(page);
    } catch (err: any) {
      console.error("❌ Update product error:", err.response?.data || err);
      message.error("Failed to update product");
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Bar */}
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-800">My Products</h2>
        <Button
          type={showForm ? "default" : "primary"}
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? "Cancel" : "➕ Add Product"}
        </Button>
      </div>

      {/* Add Product Form */}
      {showForm && (
        <Card className="rounded-xl shadow-md border border-gray-200">
          <div className="space-y-3">
            <Input
              placeholder="Product Title"
              value={newProduct.title}
              onChange={(e) =>
                setNewProduct({ ...newProduct, title: e.target.value })
              }
            />
            <Input.TextArea
              placeholder="Description"
              rows={3}
              value={newProduct.description}
              onChange={(e) =>
                setNewProduct({ ...newProduct, description: e.target.value })
              }
            />
            <Input
              type="number"
              placeholder="Price"
              value={newProduct.price}
              onChange={(e) =>
                setNewProduct({ ...newProduct, price: e.target.value })
              }
            />
            <Button type="primary" block onClick={handleCreate}>
              ✅ Save Product
            </Button>
          </div>
        </Card>
      )}

      {/* Product List */}
      {loading ? (
        <div className="flex justify-center py-8">
          <Spin size="large" />
        </div>
      ) : products.length === 0 ? (
        <p className="text-gray-500 italic">No products yet. Add one above 🚀</p>
      ) : (
        <>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {products.map((product, index) => {
              const isEditing = editIndex === index;

              return (
                <Card
                  key={product.id}
                  className="rounded-xl shadow-sm border border-gray-200 hover:shadow-lg transition-all duration-300"
                >
                  {isEditing ? (
                    <div className="space-y-2">
                      <Input
                        value={editProduct?.title}
                        onChange={(e) =>
                          setEditProduct((prev) =>
                            prev ? { ...prev, title: e.target.value } : null
                          )
                        }
                      />
                      <Input.TextArea
                        value={editProduct?.description}
                        onChange={(e) =>
                          setEditProduct((prev) =>
                            prev
                              ? { ...prev, description: e.target.value }
                              : null
                          )
                        }
                      />
                      <Input
                        type="number"
                        value={editProduct?.price}
                        onChange={(e) =>
                          setEditProduct((prev) =>
                            prev
                              ? { ...prev, price: Number(e.target.value) }
                              : null
                          )
                        }
                      />
                      <div className="flex gap-2">
                        <Button onClick={() => setEditIndex(null)}>
                          Cancel
                        </Button>
                        <Button type="primary" onClick={handleSaveEdit}>
                          Save
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <h3 className="font-semibold text-lg text-gray-800">
                        {product.title}
                      </h3>
                      <p className="text-gray-600 mt-1">{product.description}</p>
                      <p className="text-gray-900 font-bold mt-2">
                        ₦{product.price}
                      </p>
                      <div className="flex gap-2 mt-3">
                        <Button
                          onClick={() => {
                            setEditIndex(index);
                            setEditProduct(product);
                          }}
                        >
                          ✏️ Edit
                        </Button>
                        <Button danger onClick={() => handleDelete(product.id)}>
                          🗑️ Delete
                        </Button>
                      </div>
                    </div>
                  )}
                </Card>
              );
            })}
          </div>

          {/* Pagination */}
          <div className="flex justify-center mt-6">
            <Pagination
              current={page}
              pageSize={limit}
              total={total}
              onChange={(p) => setPage(p)}
              showSizeChanger={false}
            />
          </div>
        </>
      )}
    </div>
  );
};

export default ProductsTab;
