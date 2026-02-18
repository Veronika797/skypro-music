import styles from '@/app/page.module.css';
import Bar from '@bar/Bar';
import Navigation from '@navigation/Navigation';
import Sidebar from '@sidebar/Sidebar';
import Centerblock from '@centerblock/Centerblock';

export default function Home() {
  return (
    <div className={styles.wrapper}>
      <div className={styles.container}>
        <main className={styles.main}>
          <Navigation />
          <Centerblock />
          <Sidebar />
        </main>
        <Bar />
        <footer className="footer"></footer>
      </div>
    </div>
  );
}
