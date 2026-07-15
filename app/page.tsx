import styles from "./page.module.css";
import Link from "next/link";

export default function Home() {
  return (
    <main className={styles.main}>
      <div className={styles.hero}>
        <h1 className={styles.title}>
          Shohoj <span className={styles.gradientText}>Ledger</span>
        </h1>
        <p className={styles.description}>
          Company Finance & Revenue Sharing CRM
        </p>
        
        <div style={{ marginTop: '1rem', marginBottom: '2rem' }}>
          <Link 
            href="/login" 
            style={{ 
              background: 'linear-gradient(135deg, #00f2fe 0%, #4facfe 100%)', 
              color: '#fff', 
              padding: '0.75rem 2rem', 
              borderRadius: '24px', 
              textDecoration: 'none', 
              fontWeight: 600,
              fontSize: '1.1rem'
            }}
          >
            Sign In
          </Link>
        </div>
        
        <div className={styles.actionGrid}>
          <div className={styles.card}>
            <h2>Income Management &rarr;</h2>
            <p>Track full and partial payments across all active projects.</p>
          </div>
          <div className={styles.card}>
            <h2>Monthly Settlements &rarr;</h2>
            <p>Automated distribution for Marketing, Devs, and Company Reserves.</p>
          </div>
          <div className={styles.card}>
            <h2>Reserve Balance &rarr;</h2>
            <p>Monitor company funds, owner contributions, and member loans.</p>
          </div>
        </div>
      </div>
    </main>
  );
}
