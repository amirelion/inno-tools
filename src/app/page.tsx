import Link from 'next/link';
import styles from './page.module.css';

export default function Home() {
  return (
    <main className={styles.main}>
      <div className={styles.hero}>
        <h1 className={styles.title}>InnoTools</h1>
        <p className={styles.description}>
          Find the right innovation tools and methodologies for your projects
        </p>
        <div className={styles.buttonGroup}>
          <Link href="/tools" className={styles.button}>
            Browse Tools
          </Link>
          <Link href="/recommendations" className={styles.button}>
            Get Recommendations
          </Link>
        </div>
      </div>
      
      <section className={styles.features}>
        <div className={styles.feature}>
          <h2>Discover Innovation Tools</h2>
          <p>
            Browse our curated catalog of innovation tools and methodologies
            to find approaches that can help solve your challenges.
          </p>
        </div>
        
        <div className={styles.feature}>
          <h2>Personalized Recommendations</h2>
          <p>
            Answer a few questions about your project, and we'll recommend 
            the most suitable innovation tools for your specific needs.
          </p>
        </div>
        
        <div className={styles.feature}>
          <h2>Implementation Guidance</h2>
          <p>
            Get detailed implementation guides tailored to your context,
            making it easier to apply innovation tools effectively.
          </p>
        </div>
      </section>
    </main>
  );
} 