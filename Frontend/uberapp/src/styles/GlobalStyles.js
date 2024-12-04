import { createGlobalStyle } from "styled-components";

const GlobalStyles = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  body {
    font-family: Arial, sans-serif;
    background-color: #f5f5f5;
    color: #333;
  }

  .App {
    display: flex;
    flex-direction: column;
    gap: 20px;
    padding: 20px;
  }

  .main-content {
    display: flex;
    gap: 20px;
    justify-content: space-between;
  }
`;

export default GlobalStyles;
