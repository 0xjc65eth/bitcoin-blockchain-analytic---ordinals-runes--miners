import { ChakraProvider, extendTheme } from '@chakra-ui/react';
import type { AppProps } from 'next/app';
import { ErrorBoundary } from '../components/ErrorBoundary';

// Define the custom theme
const theme = extendTheme({
  colors: {
    gray: {
      dark: '#1A1A1A',
      medium: '#2D2D2D',
    },
    white: {
      text: '#FFFFFF',
    },
    blue: {
      highTech: '#00A3FF',
    },
  },
  fonts: {
    heading: 'Inter, sans-serif',
    body: 'Inter, sans-serif',
    mono: 'Roboto Mono, monospace',
  },
  styles: {
    global: {
      body: {
        bg: 'gray.dark',
        color: 'white.text',
      },
      'html, body': {
        margin: 0,
        padding: 0,
        boxSizing: 'border-box',
      },
      '*': {
        boxSizing: 'inherit',
      },
    },
  },
  components: {
    Button: {
      baseStyle: {
        _hover: {
          borderColor: 'blue.highTech',
        },
      },
    },
    Box: {
      baseStyle: {
        _hover: {
          borderColor: 'blue.highTech',
          transform: 'scale(1.02)',
          transition: 'all 0.2s',
        },
      },
    },
  },
});

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ChakraProvider theme={theme} resetCSS>
      <ErrorBoundary>
        <Component {...pageProps} />
      </ErrorBoundary>
    </ChakraProvider>
  );
} 