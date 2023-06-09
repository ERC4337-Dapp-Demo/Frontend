import '@/styles/globals.scss'
import 'antd/dist/reset.css'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import type { AppProps } from 'next/app'
import { useEffect, useState } from 'react'
import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/lib/integration/react'

import store, { persistor } from '@/configs/redux'
import LayoutDefault from '@/layouts/LayoutDefault'
import MoralisService from '@/services/moralis'

const MyApp = ({ Component, pageProps }: AppProps) => {
  const [queryClient] = useState(
    new QueryClient({
      defaultOptions: {
        queries: {
          refetchOnWindowFocus: true,
          retry: true,
        },
      },
    }),
  )

  useEffect(() => {
    MoralisService.start()
  }, [])

  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <QueryClientProvider client={queryClient}>
          <LayoutDefault>
            <Component {...pageProps} />
          </LayoutDefault>
        </QueryClientProvider>
      </PersistGate>
    </Provider>
  )
}

export default MyApp
