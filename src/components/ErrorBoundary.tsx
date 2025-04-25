import React from 'react';
import { Box } from '@chakra-ui/react';

interface Props {
  children: React.ReactNode;
}

interface State {
  hasError: boolean;
}

export class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error caught by ErrorBoundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <Box p={4} bg="gray.dark" color="white.text" textAlign="center">
          <Box fontSize="xl" mb={4}>Something went wrong 😢</Box>
          <Box>Please refresh the page or try again later.</Box>
        </Box>
      );
    }

    return this.props.children;
  }
} 