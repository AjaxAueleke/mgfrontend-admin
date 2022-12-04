import "../styles/globals.css";
import type { AppProps } from "next/app";
import { Box, ChakraProvider } from "@chakra-ui/react";
import { wrapper } from "../modules/store";
import { Provider } from "react-redux";

function MyApp({ Component, ...rest }: AppProps) {
  const { store, props } = wrapper.useWrappedStore(rest);
  const { pageProps } = props;
  return (
    <Provider store={store}>
      <ChakraProvider>
        {/* <TopBar /> */}

        <Box margin="auto">
          <Component {...pageProps} />
        </Box>
      </ChakraProvider>
    </Provider>
  );
}

export default MyApp;
