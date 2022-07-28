import {
  BoxProps,
  Box,
  StackProps,
  TextProps,
  VStack,
  Text,
  Heading,
  HeadingProps,
  Flex,
  FlexProps,
} from '@chakra-ui/react';
import { motion } from 'framer-motion';

export const MVStack = motion<StackProps>(VStack);
export const MFlex = motion<FlexProps>(Flex);
export const MText = motion<TextProps>(Text);
export const MBox = motion<BoxProps>(Box);
export const MHeading = motion<HeadingProps>(Heading);
