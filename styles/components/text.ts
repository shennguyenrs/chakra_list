import { StyleFunctionProps } from "@chakra-ui/theme-tools";

const extendedText = {
  variants: {
    isDone: ({ colorMode }: StyleFunctionProps) => ({
      textDecoration: "line-through",
      color: colorMode === "light" ? "gray.300" : "gray.700",
    }),
    notDone: ({ colorMode }: StyleFunctionProps) => ({
      textDecoration: "none",
      color: colorMode === "light" ? "gray.700" : "gray.100",
    }),
  },
};

export default extendedText;
