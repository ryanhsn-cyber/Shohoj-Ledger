"use client";

import { useState, useEffect } from "react";
import styles from "../income/page.module.css";

type FundTransaction = {
  id: string;
  amount: string;
  source: string | null;
  description: string | null;
  createdAt: string;
};

export default function FundsPage() {
  const [funds, setFunds] = useState<FundTransaction[]>([]);
  const [totalFunds, setTotalFunds] = useState(0);
  const [loading, setLoading] = useState(true);

  // Form State
  const [amount, setAmount] = useState("");
  const [source, setSource] = useState("");
  const [description, setDescription] = useState("");

  const fetchFunds = async () => {
    try {
      const res = await fetch("/api/funds");
      const data = await res.json();
      setFunds(data.funds);
      setTotalFunds(data.totalFunds);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFunds();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/funds", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount,
          source,
          description,
        }),
      });

      if (res.ok) {
        setAmount("");
        setSource("");
        setDescription("");
        fetchFunds();
      }
    } catch (err) {
      console.error("Failed to submit fund transaction", err);
    }
  };

  const formatCurrency = (val: number | string) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'BDT' }).format(Number(val));
  };

  return (
    <div className="animate-fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: "var(--spacing-6)" }}>
        <h1>Company Funds</h1>
        <div className="glass-card" style={{ padding: "var(--spacing-3) var(--spacing-5)" }}>
          <span style={{ color: "var(--text-muted)", fontSize: "0.875rem", marginRight: "12px" }}>Total Funds Inserted</span>
          <strong style={{ fontSize: "1.25rem", color: "var(--success)" }}>{formatCurrency(totalFunds)}</strong>
        </div>
      </div>

      <div className={styles.grid}>
        {/* Record Fund Form */}
        <div className="glass-card">
          <h3 style={{ marginBottom: "var(--spacing-4)" }}>Add Capital / Fund</h3>
          <p style={{ color: "var(--text-muted)", fontSize: "0.875rem", marginBottom: "var(--spacing-4)" }}>
            These funds are non-shareable and represent direct capital injections into the company.
          </p>
          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.formGroup}>
              <label className="label">Amount</label>
              <input required type="number" step="0.01" className="input" placeholder="0.00" value={amount} onChange={(e) => setAmount(e.target.value)} />
            </div>

            <div className={styles.formGroup}>
              <label className="label">Source (e.g., Owner, Investor)</label>
              <input required className="input" placeholder="Owner Name" value={source} onChange={(e) => setSource(e.target.value)} />
            </div>

            <div className={styles.formGroup}>
              <label className="label">Description</label>
              <textarea className="input" rows={3} placeholder="Initial capital, equipment purchase loan..." value={description} onChange={(e) => setDescription(e.target.value)}></textarea>
            </div>

            <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
              Record Fund Injection
            </button>
          </form>
        </div>

        {/* Funds List */}
        <div className="glass-card" style={{ overflowX: "auto" }}>
          <h3 style={{ marginBottom: "var(--spacing-4)" }}>Fund History</h3>
          {loading ? (
            <p>Loading...</p>
          ) : (
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Source</th>
                  <th>Description</th>
                  <th>Amount</th>
                </tr>
              </thead>
              <tbody>
                {funds.map((f) => (
                  <tr key={f.id}>
                    <td>{new Date(f.createdAt).toLocaleDateString()}</td>
                    <td>{f.source}</td>
                    <td>{f.description || '-'}</td>
                    <td style={{ color: "var(--success)", fontWeight: "500" }}>+{formatCurrency(f.amount)}</td>
                  </tr>
                ))}
                {funds.length === 0 && (
                  <tr>
                    <td colSpan={4} style={{ textAlign: "center", padding: "var(--spacing-4)" }}>
                      No funds recorded yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
