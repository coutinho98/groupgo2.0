import { BrowserRouter } from "react-router";
import { ThemeProvider } from "./context/ThemeProvider";
import Routers from "./Routers";


function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <Routers />
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;