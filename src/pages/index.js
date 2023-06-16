import Head from 'next/head'
import Header from '@/components/Header'
import Smasher from '@/components/Smasher'

export default function Home() {
  return (
    <>
      <Head>
        <title>pngsmasher app</title>
        <meta name="description" content="Web app to test pngsmasher :D" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main style={{display: "flex", flexDirection: "column"}}>
        <Header />
        <Smasher />
      </main>
    </>
  )
}
