import '../styles/globals.css'
import type { AppProps } from 'next/app'

import 'carbon-components/scss/globals/scss/styles.scss';

function MyApp({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />
}

export default MyApp
