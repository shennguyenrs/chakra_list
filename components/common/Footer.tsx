import { Flex, Link } from '@chakra-ui/react';

// Styles
import { gradient_pink } from '../../styles/abstracts/colors';

const Footer = () => (
  <Flex
    w="100vw"
    h="5vh"
    justify="center"
    alignItems="center"
    position="relative"
    bgColor={gradient_pink}
    fontWeight="bold"
  >
    <p>
      Build with <Link href="https://nextjs.org/">Next Js</Link>,{' '}
      <Link href="https://chakra-ui.com/">Chakra UI</Link> and{' '}
      <Link href="https://www.framer.com/">Framer</Link>
    </p>
  </Flex>
);

export default Footer;
