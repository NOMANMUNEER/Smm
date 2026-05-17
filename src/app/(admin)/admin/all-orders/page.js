"use client";

import { useState, useEffect } from "react";
import Select from "@/components/ui/Select";
import styles from "./all-orders.module.css";

const STATUS_OPTIONS = [
  { value: "", label: "All Statuses" },
  { value: "Pending", label: "Pending" },
  { value: "Processing", label: "Processing" },
  { value: "In Progress", label: "In Progress" },
  { value: "Completed", label: "Completed" },
  { value: "Cancelled", label: "Cancelled" },
  { value: "Partial", label: "Partial" },
];

const STATUS_COLORS = {
  Pending: "var(--warning)",
  Processing: "var(--info)",
  "In Progress": "var(--info)",
  Completed: "var(--success)",
  Cancelled: "var(--danger)",
  Partial: "var(--text-muted)",
};

export default function AllOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("");

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem("token");
      const query = statusFilter ? `?status=${statusFilter}` : "";
      const res = await fetch(`/api/admin/orders${query}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setOrders(data.orders || []);
    } catch {
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [statusFilter]);

  const updateStatus = async (orderId, newStatus) => {
    const token = localStorage.getItem("token");
    await fetch(`/api/admin/orders/${orderId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ status: newStatus }),
    });
    fetchOrders();
  };

  return (
    <div className={styles.page}>
      <div className={styles.headerRow}>
        <div>
          <h1 className={styles.title}>
            📦 All <span className="gradient-text">Orders</span>
          </h1>
          <p className={styles.subtitle}>View and manage all customer orders</p>
        </div>
        <div className={styles.filterWrap}>
          <Select
            id="statusFilter"
            placeholder="Filter by status"
            options={STATUS_OPTIONS}
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          />
        </div>
      </div>

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
                <th>ID</th>
                <th>User</th>
                <th>Service</th>
                <th>Link</th>
                <th>Qty</th>
                <th>Charge</th>
                <th>Status</th>
                <th>Update</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order._id} className={styles.row}>
                  <td className={styles.orderId}>
                    #{order._id.slice(-6).toUpperCase()}
                  </td>
                  <td>
                    <div>{order.userId?.userName || "—"}</div>
                    <small className={styles.emailSmall}>
                      {order.userId?.email || ""}
                    </small>
                  </td>
                  <td>
                    <div>{order.serviceId?.name || "—"}</div>
                    {order.serviceId?.categoryId?.name && (
                      <small className={styles.categorySmall}>
                        {order.serviceId.categoryId.name}
                      </small>
                    )}
                  </td>
                  <td>
                    <a
                      href={order.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={styles.link}
                    >
                      {order.link.length > 25
                        ? order.link.slice(0, 25) + "..."
                        : order.link}
                    </a>
                  </td>
                  <td>{order.quantity.toLocaleString()}</td>
                  <td className={styles.cost}>
                    ₨{order.totalCharge.toFixed(2)}
                  </td>
                  <td>
                    <span
                      className={styles.badge}
                      style={{
                        color: STATUS_COLORS[order.status],
                        background: `${STATUS_COLORS[order.status]}18`,
                        borderColor: `${STATUS_COLORS[order.status]}30`,
                      }}
                    >
                      {order.status}
                    </span>
                  </td>
                  <td>
                    <select
                      className={styles.statusSelect}
                      value={order.status}
                      onChange={(e) =>
                        updateStatus(order._id, e.target.value)
                      }
                    >
                      <option value="Pending">Pending</option>
                      <option value="Processing">Processing</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Completed">Completed</option>
                      <option value="Cancelled">Cancelled</option>
                      <option value="Partial">Partial</option>
                    </select>
                  </td>
                  <td className={styles.date}>
                    {new Date(order.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
