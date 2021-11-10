import '../components/toast/toast.scss'
import '../components/tooltip/tooltip.scss'
import '../styles/global.scss'

import BigNumber from 'bignumber.js'
import Head from 'next/head'
import { ThemeProvider } from 'next-themes'
import React from 'react'

import Notifications from '../components/Notifications'
// import ScriptAnalytics from '../components/ScriptAnalytics'
import { ModalProvider } from '../contexts/ModalContext'
import { RefreshProvider } from '../contexts/RefreshContext'

BigNumber.config({
  EXPONENTIAL_AT: 1000,
  DECIMAL_PLACES: 80,
})

function MyApp({ Component, pageProps }) {
  const title = 'PolkaSign'
  const description = 'PolkaSign'
  const keywords = 'SubDAO, IDO, PolkaSign'
  // const baseUrl = ''

  return (
    <>
      <Head>
        <title>{title}</title>
        <link rel="icon" href="/favicon.svg" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="keywords" content={keywords} />
        <meta name="description" content={description} />
        <link rel="apple-touch-icon" href="/favicon.svg" />
        <meta name="msapplication-TileColor" content="#ffffff" />
        <meta name="theme-color" content="#ffffff" />

        {/* <meta property="og:type" content="website" />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:image" content={`${baseUrl}/images/og.png`} />
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:site" content="@gopartyparrot" /> */}
      </Head>
      <ThemeProvider defaultTheme="dark" attribute="class">
        <ModalProvider>
          <RefreshProvider>
            <Component {...pageProps} />
          </RefreshProvider>
          <Notifications />
          <div id="tooltip-portal-root" />
        </ModalProvider>
        {/* <ScriptAnalytics analyticsID="G-S8MXERDM2M" /> */}
      </ThemeProvider>
    </>
  )
}

export default MyApp
