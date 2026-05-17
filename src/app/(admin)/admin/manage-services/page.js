"use client";

import dynamic from "next/dynamic";
import { useState, useEffect } from "react";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import Button from "@/components/ui/Button";
import styles from "./manage-services.module.css";

// Dynamically import React-Quill (no SSR — it requires window)
const ReactQuill = dynamic(() => import("react-quill-new"), { ssr: false });
import "react-quill-new/dist/quill.snow.css";

const SERVICE_TYPES = [
  { value: "default", label: "Default" },
  { value: "custom_comments", label: "Custom Comments" },
  { value: "package", label: "Package" },
];

export default function ManageServicesPage() {
  const [categories, setCategories] = useState([]);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // --- Category Form ---
  const [catFormOpen, setCatFormOpen] = useState(false);
  const [catForm, setCatForm] = useState({ name: "", icon: "", sortOrder: "0" });

  // --- Service Form ---
  const [form, setForm] = useState({
    categoryId: "",
    name: "",
    description: "",
    min: "100",
    max: "100000",
    price: "",
    actualPrice: "",
    serviceType: "default",
    providerId: "manual",
    externalServiceId: "",
  });

  const fetchCategories = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("/api/admin/categories", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setCategories(data.categories || []);
    } catch {
      setCategories([]);
    }
  };

  const fetchServices = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("/api/admin/services", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setServices(data.services || []);
    } catch {
      setServices([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
    fetchServices();
  }, []);

  // --- Category Handlers ---
  const handleCatSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    await fetch("/api/admin/categories", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        ...catForm,
        sortOrder: Number(catForm.sortOrder),
      }),
    });
    setCatForm({ name: "", icon: "", sortOrder: "0" });
    setCatFormOpen(false);
    fetchCategories();
  };

  const toggleCategory = async (id, isActive) => {
    const token = localStorage.getItem("token");
    await fetch(`/api/admin/categories/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ isActive: !isActive }),
    });
    fetchCategories();
  };

  // --- Service Handlers ---
  const handleChange = (e) => {
    setForm({ ...form, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("/api/admin/services", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...form,
          min: Number(form.min),
          max: Number(form.max),
          price: Number(form.price),
          actualPrice: Number(form.actualPrice || 0),
        }),
      });

      if (res.ok) {
        setForm({
          categoryId: "",
          name: "",
          description: "",
          min: "100",
          max: "100000",
          price: "",
          actualPrice: "",
          serviceType: "default",
          providerId: "manual",
          externalServiceId: "",
        });
        setFormOpen(false);
        fetchServices();
      }
    } catch {
      // handle error
    } finally {
      setSubmitting(false);
    }
  };

  const toggleActive = async (id, isActive) => {
    const token = localStorage.getItem("token");
    await fetch(`/api/admin/services/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ isActive: !isActive }),
    });
    fetchServices();
  };

  return (
    <div className={styles.page}>
      <div className={styles.headerRow}>
        <div>
          <h1 className={styles.title}>
            ⚙️ Manage <span className="gradient-text">Services</span>
          </h1>
          <p className={styles.subtitle}>
            Categories, services, pricing & rules
          </p>
        </div>
        <div className={styles.headerActions}>
          <Button
            variant="secondary"
            onClick={() => setCatFormOpen(!catFormOpen)}
          >
            {catFormOpen ? "✕ Cancel" : "📁 Add Category"}
          </Button>
          <Button onClick={() => setFormOpen(!formOpen)}>
            {formOpen ? "✕ Cancel" : "+ Add Service"}
          </Button>
        </div>
      </div>

      {/* ────── Add Category Form ────── */}
      {catFormOpen && (
        <form onSubmit={handleCatSubmit} className={styles.addForm}>
          <h3 className={styles.formTitle}>New Category</h3>
          <div className={styles.formGrid3}>
            <Input
              id="catName"
              label="Name"
              placeholder='e.g. "TikTok Likes"'
              value={catForm.name}
              onChange={(e) =>
                setCatForm({ ...catForm, name: e.target.value })
              }
              required
            />
            <Input
              id="catIcon"
              label="Icon (URL or <img> tag)"
              placeholder="https://... or <img src=...>"
              value={catForm.icon}
              onChange={(e) =>
                setCatForm({ ...catForm, icon: e.target.value })
              }
            />
            <Input
              id="catSortOrder"
              label="Sort Order"
              type="number"
              value={catForm.sortOrder}
              onChange={(e) =>
                setCatForm({ ...catForm, sortOrder: e.target.value })
              }
            />
          </div>
          <Button type="submit" fullWidth>
            Save Category
          </Button>
        </form>
      )}

      {/* ────── Categories Table ────── */}
      {categories.length > 0 && (
        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>📁 Categories</h3>
          <div className={styles.tableWrapper}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Icon</th>
                  <th>Order</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {categories.map((c) => (
                  <tr key={c._id} className={styles.row}>
                    <td className={styles.serviceName}>{c.name}</td>
                    <td>
                      {c.icon ? (
                        <span
                          dangerouslySetInnerHTML={{
                            __html: c.icon.startsWith("<")
                              ? c.icon
                              : `<img src="${c.icon}" width="20" height="20" alt="${c.name}" />`,
                          }}
                        />
                      ) : (
                        "—"
                      )}
                    </td>
                    <td>{c.sortOrder}</td>
                    <td>
                      <span
                        className={`${styles.status} ${
                          c.isActive ? styles.active : styles.inactive
                        }`}
                      >
                        {c.isActive ? "Active" : "Hidden"}
                      </span>
                    </td>
                    <td>
                      <button
                        className={styles.toggleBtn}
                        onClick={() => toggleCategory(c._id, c.isActive)}
                      >
                        {c.isActive ? "Hide" : "Show"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ────── Add Service Form ────── */}
      {formOpen && (
        <form onSubmit={handleSubmit} className={styles.addForm}>
          <h3 className={styles.formTitle}>New Service</h3>
          <div className={styles.formGrid3}>
            <Input
              id="name"
              label="Service Name"
              placeholder='e.g. "TikTok Likes - HQ"'
              value={form.name}
              onChange={handleChange}
              required
            />
            <Select
              id="categoryId"
              label="Category"
              options={categories.map((c) => ({
                value: c._id,
                label: c.name,
              }))}
              value={form.categoryId}
              onChange={handleChange}
              required
            />
            <Select
              id="serviceType"
              label="Service Type"
              options={SERVICE_TYPES}
              value={form.serviceType}
              onChange={handleChange}
              required
            />
            <Input
              id="price"
              label="Price / 1K (User)"
              type="number"
              placeholder="54"
              value={form.price}
              onChange={handleChange}
              required
            />
            <Input
              id="actualPrice"
              label="Actual Price / 1K (Cost)"
              type="number"
              placeholder="30"
              value={form.actualPrice}
              onChange={handleChange}
            />
            <Input
              id="min"
              label="Min Order"
              type="number"
              value={form.min}
              onChange={handleChange}
            />
            <Input
              id="max"
              label="Max Order"
              type="number"
              value={form.max}
              onChange={handleChange}
            />
            <Input
              id="externalServiceId"
              label="External Service ID"
              placeholder='e.g. "6247"'
              value={form.externalServiceId}
              onChange={handleChange}
            />
            <Input
              id="providerId"
              label="Provider"
              placeholder="manual"
              value={form.providerId}
              onChange={handleChange}
            />
          </div>

          {/* Rich Text Editor for Description */}
          <div className={styles.editorWrap}>
            <label className={styles.editorLabel}>
              Description / Rules (Rich Text)
            </label>
            <ReactQuill
              theme="snow"
              value={form.description}
              onChange={(val) => setForm({ ...form, description: val })}
              placeholder="Enter rules like: Don't private your account..."
              className={styles.quillEditor}
            />
          </div>

          <Button
            type="submit"
            loading={submitting}
            fullWidth
            style={{ marginTop: "1rem" }}
          >
            Save Service
          </Button>
        </form>
      )}

      {/* ────── Services Table ────── */}
      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>🛒 Services</h3>
        {loading ? (
          <div className={styles.skeleton}>
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className={styles.skeletonRow}></div>
            ))}
          </div>
        ) : (
          <div className={styles.tableWrapper}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Category</th>
                  <th>Type</th>
                  <th>Price/1K</th>
                  <th>Cost/1K</th>
                  <th>Min</th>
                  <th>Max</th>
                  <th>Provider</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {services.map((s) => (
                  <tr key={s._id} className={styles.row}>
                    <td className={styles.serviceName}>{s.name}</td>
                    <td>{s.categoryId?.name || "—"}</td>
                    <td>
                      <span className={styles.typeBadge}>{s.serviceType}</span>
                    </td>
                    <td className={styles.rate}>₨{s.price}</td>
                    <td className={styles.actualRate}>₨{s.actualPrice}</td>
                    <td>{s.min.toLocaleString()}</td>
                    <td>{s.max.toLocaleString()}</td>
                    <td className={styles.providerCell}>{s.providerId}</td>
                    <td>
                      <span
                        className={`${styles.status} ${
                          s.isActive ? styles.active : styles.inactive
                        }`}
                      >
                        {s.isActive ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td>
                      <button
                        className={styles.toggleBtn}
                        onClick={() => toggleActive(s._id, s.isActive)}
                      >
                        {s.isActive ? "Disable" : "Enable"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
