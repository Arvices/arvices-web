import { AuthProvider } from "./contexts/AuthContext";
import Navigation from "./navigation";
import ErrorBoundary from "./pages/util/errorboundary";
import { Provider } from "react-redux";
import { store } from "./store/store";
import { LoadingProvider } from "./contexts/LoadingContext";
import { ThemeProvider } from "./contexts/ThemeContext";

function App() {
  return (
    <>
      <ErrorBoundary>
        <Provider store={store}>
          <LoadingProvider>
            <AuthProvider>
              <ThemeProvider>
                <Navigation />
              </ThemeProvider>
            </AuthProvider>
          </LoadingProvider>
        </Provider>
      </ErrorBoundary>
    </>
  );
}

export default App;
