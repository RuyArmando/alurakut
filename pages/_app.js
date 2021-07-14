import { createGlobalStyle, ThemeProvider } from "styled-components";

const GlobalStyle = createGlobalStyle`
  /* Reset CSS */
  *{
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }
  
body {
    background-image: linear-gradient(to bottom, #D9E6F6, #F1F9FE);
    font-family: sans-serif;
  }
  
#__next{
  display: flex;
  min-height: 100vh;
  flex-direction: column;
}

img{
  max-width: 100%;
  height: auto;
  display: block;
}
`;

const theme = {
  colors: {
    primary: "#0070f3",
  },
};

export default function App({ Component, pageProps }) {
  return (
    <>
      <GlobalStyle />
      <ThemeProvider theme={theme}>
        <Component {...pageProps} />
      </ThemeProvider>
    </>
  );
}
