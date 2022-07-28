import { useColorModeValue } from '@chakra-ui/color-mode';
import { forwardRef, ReactNode, MouseEvent } from 'react';

import { MBox } from './MotionComponents';

type RoundedButtonTypes = {
  children: ReactNode;
  onClick?: (e: MouseEvent) => void;
};

const RoundedButton = forwardRef<HTMLButtonElement, RoundedButtonTypes>(
  ({ children, ...rest }, ref) => {
    const toggleButton = useColorModeValue('gray.900', 'gray.100');

    return (
      <MBox
        ref={ref}
        as="button"
        rounded="full"
        p=".8rem"
        bgColor={toggleButton}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        {...rest}
      >
        {children}
      </MBox>
    );
  }
);

RoundedButton.displayName = 'RoundedButton';

export default RoundedButton;
