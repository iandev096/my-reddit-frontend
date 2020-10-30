import { Box } from '@chakra-ui/core';
import React from 'react';

interface WrapperProps {
  variant?: 'small' | 'regular'
}

const Wrapper: React.FC<WrapperProps> = ({ children, variant = 'regular', ...rest }) => {

  return (
    <Box
      maxW={variant === 'regular' ? '800px' : '400px'}
      mx='auto'
      w='100%'
      mt={8}
      {...rest}
    >
      {children}
    </Box>
  );
};

export default Wrapper