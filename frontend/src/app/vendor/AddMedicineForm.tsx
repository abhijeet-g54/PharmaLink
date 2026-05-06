import { useState } from "react";
import axios from "axios";

const API = import.meta.env.VITE_VENDOR_API;

export default function AddMedicineForm({ token, onAdded }) {
  const [form, setForm] = useState({
    name: "",
    dosage: "",
    form: "Tablet",
    compound: "",
    compoundDosage: "",
    manufacturer: "",
    price: 0,
    discount: 0,
    stock: 0,
    isNppaRegulated: false,
    packaging: "",
  });

  const handleChange = (key: string, value: any) => {
    setForm((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleSubmit = async () => {
    try {
      if (!token) {
        alert("Missing vendor token");
        return;
      }

      await axios.post(
        `${API}/vendor/medicine`,
        {
          ...form,
          price: Number(form.price),
          discount: Number(form.discount),
          stock: Number(form.stock),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setForm({
        name: "",
        dosage: "",
        form: "Tablet",
        compound: "",
        compoundDosage: "",
        manufacturer: "",
        price: 0,
        discount: 0,
        stock: 0,
        isNppaRegulated: false,
        packaging: "",
      });

      onAdded && onAdded();
    } catch (err) {
      console.error("Add medicine error:", err);
      alert("Failed to add medicine");
    }
  };

  return (
  <div className="mb-6 p-6 border rounded bg-white shadow">
    <h2 className="font-bold mb-4 text-xl">Add Medicine</h2>

    <div className="grid grid-cols-2 gap-4">

      {/* Basic Info */}
      <div className="col-span-2 font-semibold text-gray-600">Basic Info</div>

      <div>
        <label className="block text-sm mb-1">Medicine Name</label>
        <input className="w-full border p-2 rounded"
          value={form.name}
          onChange={(e) => handleChange("name", e.target.value)}
        />
      </div>

      <div>
        <label className="block text-sm mb-1">Dosage (e.g. 500mg)</label>
        <input className="w-full border p-2 rounded"
          value={form.dosage}
          onChange={(e) => handleChange("dosage", e.target.value)}
        />
      </div>

      <div>
        <label className="block text-sm mb-1">Form</label>
        <select
          className="w-full border p-2 rounded"
          value={form.form}
          onChange={(e) => handleChange("form", e.target.value)}
        >
          <option>Tablet</option>
          <option>Syrup</option>
          <option>Capsule</option>
          <option>Injection</option>
        </select>
      </div>

      <div>
        <label className="block text-sm mb-1">Manufacturer</label>
        <input className="w-full border p-2 rounded"
          value={form.manufacturer}
          onChange={(e) => handleChange("manufacturer", e.target.value)}
        />
      </div>

      {/* Composition */}
      <div className="col-span-2 font-semibold text-gray-600 mt-2">Composition</div>

      <div>
        <label className="block text-sm mb-1">Compound</label>
        <input className="w-full border p-2 rounded"
          value={form.compound}
          onChange={(e) => handleChange("compound", e.target.value)}
        />
      </div>

      <div>
        <label className="block text-sm mb-1">Compound Dosage</label>
        <input className="w-full border p-2 rounded"
          value={form.compoundDosage}
          onChange={(e) => handleChange("compoundDosage", e.target.value)}
        />
      </div>

      {/* Pricing */}
      <div className="col-span-2 font-semibold text-gray-600 mt-2">Pricing & Stock</div>

      <div>
        <label className="block text-sm mb-1">Price (₹)</label>
        <input type="number" className="w-full border p-2 rounded"
          value={form.price}
          onChange={(e) => handleChange("price", e.target.value)}
        />
      </div>

      <div>
        <label className="block text-sm mb-1">Discount (%)</label>
        <input type="number" className="w-full border p-2 rounded"
          value={form.discount}
          onChange={(e) => handleChange("discount", e.target.value)}
        />
      </div>

      <div>
        <label className="block text-sm mb-1">Stock</label>
        <input type="number" className="w-full border p-2 rounded"
          value={form.stock}
          onChange={(e) => handleChange("stock", e.target.value)}
        />
      </div>

      <div>
        <label className="block text-sm mb-1">Packaging</label>
        <input className="w-full border p-2 rounded"
          value={form.packaging}
          onChange={(e) => handleChange("packaging", e.target.value)}
        />
      </div>

      <label className="flex items-center gap-2 col-span-2 mt-2">
        <input
          type="checkbox"
          checked={form.isNppaRegulated}
          onChange={(e) => handleChange("isNppaRegulated", e.target.checked)}
        />
        NPPA Regulated (Govt price control)
      </label>
    </div>

    <button
      disabled={!token}
      onClick={handleSubmit}
      className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded disabled:opacity-50"
    >
      Add Medicine
    </button>
  </div>
);
}