"use client";

import { useState, useEffect } from "react";
import styles from "../income/page.module.css"; // Reuse the layout grid styles

type Project = {
  id: string;
  name: string;
  clientName: string | null;
  status: string;
  totalIncome: number;
  totalExpense: number;
  profitability: number;
  createdAt: string;
};

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  // Form State
  const [name, setName] = useState("");
  const [clientName, setClientName] = useState("");

  const fetchProjects = async () => {
    try {
      const res = await fetch("/api/projects");
      const data = await res.json();
      setProjects(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          clientName,
        }),
      });

      if (res.ok) {
        setName("");
        setClientName("");
        fetchProjects();
      }
    } catch (err) {
      console.error("Failed to create project", err);
    }
  };

  const updateStatus = async (id: string, newStatus: string) => {
    try {
      const res = await fetch("/api/projects", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status: newStatus }),
      });
      if (res.ok) {
        fetchProjects();
      }
    } catch (err) {
      console.error("Failed to update status", err);
    }
  };

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'BDT' }).format(val);
  };

  const getProfitabilityColor = (val: number) => {
    if (val > 0) return "var(--success)";
    if (val < 0) return "var(--danger)";
    return "var(--text-muted)";
  };

  return (
    <div className="animate-fade-in">
      <h1 style={{ marginBottom: "var(--spacing-6)" }}>Project Profitability Tracking</h1>

      <div className={styles.grid}>
        {/* Create Project Form */}
        <div className="glass-card">
          <h3 style={{ marginBottom: "var(--spacing-4)" }}>Start New Project</h3>
          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.formGroup}>
              <label className="label">Project Name</label>
              <input required className="input" placeholder="e.g. Q3 Marketing Campaign" value={name} onChange={(e) => setName(e.target.value)} />
            </div>

            <div className={styles.formGroup}>
              <label className="label">Client Name (Optional)</label>
              <input className="input" placeholder="e.g. Acme Corp" value={clientName} onChange={(e) => setClientName(e.target.value)} />
            </div>

            <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
              Create Project
            </button>
          </form>
        </div>

        {/* Projects List */}
        <div className="glass-card" style={{ overflowX: "auto" }}>
          <h3 style={{ marginBottom: "var(--spacing-4)" }}>Active Projects & P&L</h3>
          {loading ? (
            <p>Loading...</p>
          ) : (
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Project Name</th>
                  <th>Client</th>
                  <th>Total Income</th>
                  <th>Total Expense</th>
                  <th>Profitability</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {projects.map((proj) => (
                  <tr key={proj.id}>
                    <td>{proj.name}</td>
                    <td>{proj.clientName || '-'}</td>
                    <td style={{ color: "var(--success)" }}>+{formatCurrency(proj.totalIncome)}</td>
                    <td style={{ color: "var(--danger)" }}>-{formatCurrency(proj.totalExpense)}</td>
                    <td style={{ fontWeight: 600, color: getProfitabilityColor(proj.profitability) }}>
                      {proj.profitability > 0 ? '+' : ''}{formatCurrency(proj.profitability)}
                    </td>
                    <td>
                      <span className={`${styles.badge} ${proj.status === 'ACTIVE' ? styles['badge-partial'] : styles['badge-paid']}`}>
                        {proj.status}
                      </span>
                      <br/>
                      {proj.status === 'ACTIVE' && (
                         <button onClick={() => updateStatus(proj.id, "COMPLETED")} className="btn btn-secondary" style={{ marginTop: '4px', padding: '2px 6px', fontSize: '10px' }}>Mark Completed</button>
                      )}
                    </td>
                  </tr>
                ))}
                {projects.length === 0 && (
                  <tr>
                    <td colSpan={6} style={{ textAlign: "center", padding: "var(--spacing-4)" }}>
                      No projects created yet.
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
