"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Bar, Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

type OverviewData = {
  reserveBalance: number;
  totalIncome: number;
  totalExpenses: number;
  netCashFlow: number;
  outstandingLoans: number;
  activeAdvances: number;
};

export default function DashboardIndex() {
  const [data, setData] = useState<OverviewData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOverview = async () => {
      try {
        const res = await fetch("/api/overview");
        const json = await res.json();
        setData(json);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchOverview();
  }, []);

  const formatCurrency = (val: number | string) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'BDT' }).format(Number(val));
  };

  // Chart Configurations
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: '#1F2937',
        titleColor: '#F8FAFC',
        bodyColor: '#c3c6d7',
        borderColor: '#334155',
        borderWidth: 1,
        padding: 12,
        displayColors: true,
        boxPadding: 4
      }
    },
    scales: {
      x: {
        grid: { display: false, drawBorder: false },
        ticks: { color: '#94A3B8', font: { family: 'Inter', size: 12 } }
      },
      y: {
        grid: { color: '#334155', drawBorder: false, borderDash: [4, 4] },
        ticks: { color: '#94A3B8', font: { family: 'Inter', size: 12 }, maxTicksLimit: 5 }
      }
    }
  };

  // Mock data for charts (would be replaced by real API data in the future)
  const revExpData = {
    labels: ['May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct'],
    datasets: [
      {
        label: 'Revenue',
        data: [15000, 18000, 16000, 22000, 20000, 24000],
        backgroundColor: '#10b981', // success color
        borderRadius: 4,
        barPercentage: 0.6,
        categoryPercentage: 0.8
      },
      {
        label: 'Expenses',
        data: [12000, 14000, 13000, 16000, 15000, 17000],
        backgroundColor: '#ef4444', // danger color
        borderRadius: 4,
        barPercentage: 0.6,
        categoryPercentage: 0.8
      }
    ]
  };

  const cashFlowData = {
    labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
    datasets: [
      {
        label: 'Net Cash',
        data: [5000, 8000, 4500, 9200],
        borderColor: '#3b82f6', // primary color
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        borderWidth: 2,
        tension: 0.4,
        fill: true,
        pointBackgroundColor: '#3b82f6',
        pointBorderColor: '#0b0f19',
        pointBorderWidth: 2,
        pointRadius: 4,
        pointHoverRadius: 6
      }
    ]
  };

  if (loading || !data) {
    return <div style={{ padding: '2rem', textAlign: 'center' }}>Loading metrics...</div>;
  }

  return (
    <div className="animate-fade-in" style={{ paddingBottom: '2rem' }}>
      
      {/* Dashboard Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '24px' }}>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: 'bold' }}>Financial Overview</h1>
          <p style={{ margin: '4px 0 0 0', fontSize: '14px' }}>Current fiscal status as of today.</p>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button className="btn btn-secondary" style={{ padding: '6px 12px', fontSize: '12px' }}>This Month</button>
          <Link href="/dashboard/settlement" className="btn btn-primary" style={{ padding: '6px 12px', fontSize: '12px' }}>
            Run Settlement
          </Link>
        </div>
      </div>

      {/* Bento Grid Summary Cards */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
        gap: '16px',
        marginBottom: '24px'
      }}>
        
        {/* Total Income */}
        <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Total Income</span>
            <span style={{ color: 'var(--success)', background: 'rgba(16,185,129,0.1)', padding: '6px', borderRadius: '8px', fontSize: '14px', fontWeight: 'bold' }}>↑</span>
          </div>
          <div style={{ marginTop: '16px' }}>
            <span style={{ fontSize: '32px', fontWeight: 700, letterSpacing: '-0.02em' }}>{formatCurrency(data.totalIncome)}</span>
            <div style={{ display: 'flex', gap: '4px', fontSize: '14px', marginTop: '4px' }}>
              <span style={{ color: 'var(--success)' }}>PAID & PARTIAL</span>
            </div>
          </div>
        </div>

        {/* Total Expenses */}
        <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Total Expenses</span>
            <span style={{ color: 'var(--danger)', background: 'rgba(239,68,68,0.1)', padding: '6px', borderRadius: '8px', fontSize: '14px', fontWeight: 'bold' }}>↓</span>
          </div>
          <div style={{ marginTop: '16px' }}>
            <span style={{ fontSize: '32px', fontWeight: 700, letterSpacing: '-0.02em' }}>{formatCurrency(data.totalExpenses)}</span>
            <div style={{ display: 'flex', gap: '4px', fontSize: '14px', marginTop: '4px' }}>
              <span style={{ color: 'var(--danger)' }}>APPROVED</span>
            </div>
          </div>
        </div>

        {/* Reserve Balance */}
        <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '20px', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', right: '-16px', top: '-16px', width: '96px', height: '96px', background: 'rgba(59,130,246,0.1)', borderRadius: '50%', filter: 'blur(24px)' }}></div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', position: 'relative', zIndex: 10 }}>
            <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Reserve Balance</span>
            <span style={{ color: 'var(--primary)', background: 'rgba(59,130,246,0.1)', padding: '6px', borderRadius: '8px', fontSize: '14px', fontWeight: 'bold' }}>★</span>
          </div>
          <div style={{ marginTop: '16px', position: 'relative', zIndex: 10 }}>
            <span style={{ fontSize: '32px', fontWeight: 700, letterSpacing: '-0.02em' }}>{formatCurrency(data.reserveBalance)}</span>
            <div style={{ width: '100%', background: 'rgba(255,255,255,0.1)', height: '6px', borderRadius: '99px', marginTop: '12px', overflow: 'hidden' }}>
               <div style={{ background: 'var(--primary)', height: '100%', width: '100%', borderRadius: '99px' }}></div>
            </div>
          </div>
        </div>

        {/* Active Advances */}
        <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Due Advances</span>
          </div>
          <div style={{ marginTop: '16px', display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' }}>
            <div>
              <span style={{ fontSize: '24px', fontWeight: 600 }}>{formatCurrency(data.activeAdvances)}</span>
              <p style={{ margin: 0, fontSize: '14px' }}>Receivables</p>
            </div>
            <Link href="/dashboard/advances" style={{ color: 'var(--primary)', fontSize: '12px', fontWeight: 600 }}>View All</Link>
          </div>
        </div>

        {/* Active Loans */}
        <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Outstanding Loans</span>
          </div>
          <div style={{ marginTop: '16px', display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' }}>
            <div>
              <span style={{ fontSize: '24px', fontWeight: 600 }}>{formatCurrency(data.outstandingLoans)}</span>
              <p style={{ margin: 0, fontSize: '14px' }}>Principal Remaining</p>
            </div>
            <Link href="/dashboard/loans" style={{ color: 'var(--primary)', fontSize: '12px', fontWeight: 600 }}>View All</Link>
          </div>
        </div>

      </div>

      {/* Charts Section */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', 
        gap: '16px',
        marginBottom: '24px'
      }}>
        {/* Revenue vs Expense Chart */}
        <div className="glass-card" style={{ padding: '20px', height: '360px', display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 600, margin: 0 }}>Revenue vs Expense</h3>
          </div>
          <div style={{ flex: 1, position: 'relative' }}>
            <Bar data={revExpData} options={chartOptions as any} />
          </div>
        </div>

        {/* Cash Flow Line Chart */}
        <div className="glass-card" style={{ padding: '20px', height: '360px', display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 600, margin: 0 }}>Cash Flow Trend</h3>
          </div>
          <div style={{ flex: 1, position: 'relative' }}>
            <Line data={cashFlowData} options={chartOptions as any} />
          </div>
        </div>
      </div>
      
      {/* Recent Transactions Table */}
      <div className="glass-card" style={{ padding: '20px', overflowX: 'auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h3 style={{ fontSize: '16px', fontWeight: 600, margin: 0 }}>Recent Transactions</h3>
          <Link href="/dashboard/income" style={{ color: 'var(--primary)', fontSize: '12px', fontWeight: 600 }}>View Complete Ledger &rarr;</Link>
        </div>
        <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: 'rgba(255,255,255,0.05)', color: 'var(--text-muted)', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              <th style={{ padding: '12px', fontWeight: 'normal' }}>Date</th>
              <th style={{ padding: '12px', fontWeight: 'normal' }}>Category</th>
              <th style={{ padding: '12px', fontWeight: 'normal', textAlign: 'right' }}>Amount</th>
              <th style={{ padding: '12px', fontWeight: 'normal', textAlign: 'center' }}>Status</th>
            </tr>
          </thead>
          <tbody style={{ fontSize: '14px' }}>
            <tr style={{ borderBottom: '1px solid var(--border)' }}>
              <td style={{ padding: '12px', color: 'var(--text-muted)' }}>Oct 24, 2023</td>
              <td style={{ padding: '12px' }}>Design Assets</td>
              <td style={{ padding: '12px', textAlign: 'right', color: 'var(--danger)', fontFamily: 'monospace' }}>-$450.00</td>
              <td style={{ padding: '12px', textAlign: 'center' }}>
                <span style={{ display: 'inline-block', padding: '4px 8px', borderRadius: '4px', fontSize: '12px', fontWeight: 600, background: 'rgba(16,185,129,0.1)', color: 'var(--success)' }}>Paid</span>
              </td>
            </tr>
            <tr style={{ borderBottom: '1px solid var(--border)' }}>
              <td style={{ padding: '12px', color: 'var(--text-muted)' }}>Oct 23, 2023</td>
              <td style={{ padding: '12px' }}>Client Retainer</td>
              <td style={{ padding: '12px', textAlign: 'right', color: 'var(--success)', fontFamily: 'monospace' }}>+$5,000.00</td>
              <td style={{ padding: '12px', textAlign: 'center' }}>
                <span style={{ display: 'inline-block', padding: '4px 8px', borderRadius: '4px', fontSize: '12px', fontWeight: 600, background: 'rgba(148,163,184,0.1)', color: 'var(--text-muted)' }}>Pending</span>
              </td>
            </tr>
            <tr style={{ borderBottom: '1px solid var(--border)' }}>
              <td style={{ padding: '12px', color: 'var(--text-muted)' }}>Oct 21, 2023</td>
              <td style={{ padding: '12px' }}>Server Hosting</td>
              <td style={{ padding: '12px', textAlign: 'right', color: 'var(--danger)', fontFamily: 'monospace' }}>-$120.00</td>
              <td style={{ padding: '12px', textAlign: 'center' }}>
                <span style={{ display: 'inline-block', padding: '4px 8px', borderRadius: '4px', fontSize: '12px', fontWeight: 600, background: 'rgba(16,185,129,0.1)', color: 'var(--success)' }}>Paid</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

    </div>
  );
}
