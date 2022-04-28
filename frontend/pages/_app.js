import '../styles/globals.css'
import styles from '../styles/Home.module.css'
import Head from 'next/head'

export default function MyApp({ Component, pageProps }) {
  return (
    <div className={styles.container}>
      <Head>
        <title>Interactive Poll</title>
        <meta name="description" content="Creae poll to vote on" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <Component/>
      </main>

      <footer className={styles.footer}>
        <a
          href="https://www.linkedin.com/in/dominik-polzer-hi-o/"
          target="_blank"
          rel="noopener noreferrer"
          title="Dominik Polzer"
        >
          Contact:
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" height="20" className="h-6 text-teal-500 px-4" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </a>
      </footer>
    </div>
  )
}
