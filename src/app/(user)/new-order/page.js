"use client";

import { useState, useEffect } from "react";
import Select from "@/components/ui/Select";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import styles from "./new-order.module.css";

export default function NewOrderPage() {
  const [categories, setCategories] = useState([]);
  const [categoryId, setCategoryId] = useState("");
  const [services, setServices] = useState([]);
  const [selectedService, setSelectedService] = useState("");
  const [link, setLink] = useState("");
  const [quantity, setQuantity] = useState("");
  const [comments, setComments] = useState("");
  const [loading, setLoading] = useState(false);
  const [servicesLoading, setServicesLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  // Fetch categories on mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch("/api/categories");
        const data = await res.json();
        setCategories(data.categories || []);
      } catch {
        setCategories([]);
      }
    };
    fetchCategories();
  }, []);

  // Fetch services when category changes
  useEffect(() => {
    if (!categoryId) {
      setServices([]);
      setSelectedService("");
      return;
    }

    const fetchServices = async () => {
      setServicesLoading(true);
      try {
        const res = await fetch(`/api/services?categoryId=${categoryId}`);
        const data = await res.json();
        setServices(data.services || []);
        setSelectedService("");
      } catch {
        setServices([]);
      } finally {
        setServicesLoading(false);
      }
    };

    fetchServices();
  }, [categoryId]);

  // Current selected service details
  const service = services.find((s) => s._id === selectedService);
  const isCustomComments = service?.serviceType === "custom_comments";
  const cost =
    service && quantity
      ? ((service.price / 1000) * Number(quantity)).toFixed(2)
      : "0.00";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const token = localStorage.getItem("token");
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          serviceId: selectedService,
          link,
          quantity: Number(quantity),
          comments: isCustomComments ? comments : "",
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Failed to place order");
        return;
      }

      setSuccess(
        `Order #${data.order._id.slice(-6).toUpperCase()} placed successfully!`
      );
      setCategoryId("");
      setLink("");
      setQuantity("");
      setComments("");
      setSelectedService("");
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1 className={styles.title}>
          🛒 New <span className="gradient-text">Order</span>
        </h1>
        <p className={styles.subtitle}>Select a service and place your order</p>
      </div>

      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.card}>
          <div className={styles.grid}>
            {/* Category Dropdown */}
            <Select
              id="categoryId"
              label="Category"
              placeholder="Choose a platform"
              options={categories.map((c) => ({
                value: c._id,
                label: c.name,
              }))}
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              required
            />

            {/* Service Dropdown */}
            <Select
              id="service"
              label="Service"
              placeholder={
                servicesLoading ? "Loading..." : "Choose a service"
              }
              options={services.map((s) => ({
                value: s._id,
                label: `${s.name} — ₨${s.price}/1K`,
              }))}
              value={selectedService}
              onChange={(e) => setSelectedService(e.target.value)}
              required
              disabled={!categoryId || servicesLoading}
            />

            {/* Link Input */}
            <Input
              id="link"
              label="Link"
              placeholder="https://tiktok.com/@yourpage/video/..."
              value={link}
              onChange={(e) => setLink(e.target.value)}
              required
            />

            {/* Quantity Input */}
            <Input
              id="quantity"
              label="Quantity"
              type="number"
              placeholder={
                service
                  ? `Min: ${service.min} — Max: ${service.max}`
                  : "Enter quantity"
              }
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              required
              min={service?.min || 1}
              max={service?.max || 100000}
            />
          </div>

          {/* Custom Comments — only for custom_comments serviceType */}
          {isCustomComments && (
            <div className={styles.commentsBox}>
              <label htmlFor="comments" className={styles.commentsLabel}>
                Comments <span style={{ color: "var(--danger)" }}>*</span>
              </label>
              <textarea
                id="comments"
                className={styles.commentsInput}
                placeholder="Enter your custom comments (one per line)..."
                value={comments}
                onChange={(e) => setComments(e.target.value)}
                rows={6}
                required
              />
            </div>
          )}

          {/* Service Description / Rules */}
          {service?.description && (
            <div
              className={styles.rulesBox}
              dangerouslySetInnerHTML={{ __html: service.description }}
            />
          )}

          {/* Cost Preview */}
          <div className={styles.costPreview}>
            <div className={styles.costRow}>
              <span>Estimated Cost</span>
              <span className={styles.costValue}>₨{cost}</span>
            </div>
          </div>

          {error && <p className={styles.error}>{error}</p>}
          {success && <p className={styles.success}>{success}</p>}

          <Button type="submit" fullWidth size="lg" loading={loading}>
            Place Order — ₨{cost}
          </Button>
        </div>
      </form>
    </div>
  );
}
