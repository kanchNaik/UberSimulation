import { createGlobalStyle } from "styled-components";

const GlobalStyles = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  :root {
    --font-family: Arial, sans-serif;
    --primary-color: black;
    --secondary-color: #f1f1f1;
    --border-radius: 10px;
  }

  body {
    font-family: var(--font-family);
    margin: 0;
    padding: 0;
  }

  .App {
    display: flex;
    flex-direction: column;
    gap: 20px;
    padding: 20px;
  }

  .main-content {
    gap: 20px;
    justify-content: space-between;
  }
`;

export default GlobalStyles;
