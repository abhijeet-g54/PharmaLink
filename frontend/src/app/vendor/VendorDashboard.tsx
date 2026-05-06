import { useEffect, useState } from "react";
import axios from "axios";
import AddMedicineForm from "./AddMedicineForm";

const API = import.meta.env.VITE_VENDOR_API;

export default function VendorDashboard() {
  const [token, setToken] = useState<string | null>(null);
  const [medicines, setMedicines] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<any>({});

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const urlToken = params.get("token");

    if (urlToken) {
      localStorage.setItem("vendorToken", urlToken);
      setToken(urlToken);
      window.history.replaceState({}, document.title, "/vendor");
    } else {
      const stored = localStorage.getItem("vendorToken");
      if (stored) setToken(stored);
    }

    setLoading(false);
  }, []);

  const fetchInventory = async () => {
    try {
      if (!token) return;

      const res = await axios.get(`${API}/vendor/inventory`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setMedicines(res.data);
    } catch (err) {
      console.error("Fetch inventory error:", err);
    }
  };

  useEffect(() => {
    if (token) fetchInventory();
  }, [token]);

  const handleDelete = async (id: string) => {
    try {
      if (!token) return;

      await axios.delete(`${API}/vendor/medicine/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      fetchInventory();
    } catch (err) {
      console.error("Delete error:", err);
      alert("Failed to delete medicine");
    }
  };

  const startEdit = (med: any) => {
    setEditingId(med._id);
    setEditForm({ ...med });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditForm({});
  };

  const saveEdit = async () => {
    try {
      if (!token || !editingId) return;

      await axios.put(
        `${API}/vendor/medicine/${editingId}`,
        {
          ...editForm,
          price: Number(editForm.price),
          discount: Number(editForm.discount),
          stock: Number(editForm.stock),
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setEditingId(null);
      fetchInventory();
    } catch (err) {
      console.error("Update error:", err);
      alert("Failed to update medicine");
    }
  };

  if (loading) return <div className="p-6">Loading...</div>;

  if (!token) {
    return (
      <div className="p-6 text-red-500">
        Not authenticated. Please login again.
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Vendor Dashboard</h1>

      <AddMedicineForm token={token} onAdded={fetchInventory} />

      <div className="mt-6">
        <h2 className="text-xl font-semibold mb-2">Inventory</h2>

        {medicines.length === 0 ? (
          <p>No medicines found</p>
        ) : (
          <ul className="space-y-3">
            {medicines.map((med: any) => {
              const finalPrice =
                med.price - (med.price * (med.discount || 0)) / 100;

              const isEditing = editingId === med._id;

              return (
                <li
                  key={med._id}
                  className="border p-4 rounded flex justify-between items-center"
                >
                  {isEditing ? (
                    <div className="flex gap-2 items-center">
                      <input
                        type="number"
                        value={editForm.price}
                        onChange={(e) =>
                          setEditForm({ ...editForm, price: e.target.value })
                        }
                        className="border p-1 w-20"
                      />
                      <input
                        type="number"
                        value={editForm.discount}
                        onChange={(e) =>
                          setEditForm({
                            ...editForm,
                            discount: e.target.value,
                          })
                        }
                        className="border p-1 w-16"
                      />
                      <input
                        type="number"
                        value={editForm.stock}
                        onChange={(e) =>
                          setEditForm({ ...editForm, stock: e.target.value })
                        }
                        className="border p-1 w-16"
                      />
                    </div>
                  ) : (
                    <div>
                      <div className="font-semibold">
                        {med.name} ({med.dosage})
                      </div>

                      <div className="text-sm text-gray-600">
                        {med.manufacturer} • {med.form}
                      </div>

                      <div className="text-sm">
                        ₹{med.price} ({med.discount || 0}% off) → ₹
                        {finalPrice.toFixed(2)} | Stock: {med.stock}
                      </div>
                    </div>
                  )}

                  <div className="flex gap-2">
                    {isEditing ? (
                      <>
                        <button
                          onClick={saveEdit}
                          className="bg-green-600 text-white px-3 py-1 rounded"
                        >
                          Save
                        </button>
                        <button
                          onClick={cancelEdit}
                          className="bg-gray-400 text-white px-3 py-1 rounded"
                        >
                          Cancel
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() => startEdit(med)}
                          className="bg-blue-500 text-white px-3 py-1 rounded"
                        >
                          Edit
                        </button>

                        <button
                          onClick={() => handleDelete(med._id)}
                          className="bg-red-500 text-white px-3 py-1 rounded"
                        >
                          Delete
                        </button>
                      </>
                    )}
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}