"use client";

import { useState, useEffect } from "react";
import styles from "./orders.module.css";

const STATUS_COLORS = {
  Pending: "var(--warning)",
  Processing: "var(--info)",
  "In Progress": "var(--info)",
  Completed: "var(--success)",
  Cancelled: "var(--danger)",
  Partial: "var(--text-muted)",
};

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch("/api/orders", {
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
    fetchOrders();
  }, []);

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1 className={styles.title}>
          📋 My <span className="gradient-text">Orders</span>
        </h1>
        <p className={styles.subtitle}>Track the status of your orders</p>
      </div>

      {loading ? (
        <div className={styles.skeleton}>
          {[1, 2, 3].map((i) => (
            <div key={i} className={styles.skeletonRow}></div>
          ))}
        </div>
      ) : orders.length === 0 ? (
        <div className={styles.empty}>
          <p>🛒 No orders yet. Place your first order!</p>
        </div>
      ) : (
        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>ID</th>
                <th>Service</th>
                <th>Link</th>
                <th>Quantity</th>
                <th>Charge</th>
                <th>Status</th>
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
                    <div>{order.serviceId?.name || "—"}</div>
                    {order.serviceId?.categoryId?.name && (
                      <small className={styles.categoryTag}>
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
                      {order.link.length > 30
                        ? order.link.slice(0, 30) + "..."
                        : order.link}
                    </a>
                  </td>
                  <td>{order.quantity.toLocaleString()}</td>
                  <td className={styles.cost}>₨{order.totalCharge.toFixed(2)}</td>
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
