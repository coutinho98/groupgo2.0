import { BrowserRouter } from "react-router";
import { ThemeProvider } from "./context/ThemeProvider";
import Routers from "./Routers";
import { AuthProvider } from "./context/AuthContext";


function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <AuthProvider>
          <Routers />
        </AuthProvider>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;