import React from 'react';
import { ThemeProvider, GlobalStyle } from "@react95/core"
import Desktop from "./components/Desktop"
import Taskbar from "./components/Taskbar"
import './App.css';

function App() {
  return (
    <div>
      <ThemeProvider>
        <GlobalStyle />
          <Desktop />
          <Taskbar />
      </ThemeProvider>
    </div>
  );
}

export default App;
