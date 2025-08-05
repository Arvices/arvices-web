import { AuthProvider } from "./contexts/AuthContext";
import Navigation from "./navigation";
import ErrorBoundary from "./pages/util/errorboundary";
import { Provider } from "react-redux";
import { store } from "./store/store";
import { LoadingProvider } from "./contexts/LoadingContext";
import { ThemeProvider } from "./contexts/ThemeContext";
import { useEffect } from "react";
import { NotificationProvider } from "./contexts/NotificationContext";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { CategoryProvider } from "./contexts/CategoryContext";
import { LocationProvider } from "./contexts/LocationContext";

function App() {
  useEffect(() => {
    // Force light mode on first load
    document.documentElement.classList.remove("dark");
  }, []);
  return (
    <>
      <ErrorBoundary>
        <Provider store={store}>
          <NotificationProvider>
            <CategoryProvider>
              <LoadingProvider>
                <AuthProvider>
                  <GoogleOAuthProvider clientId="246891298847-ukttjjfu01ibg3mfj5tr5o8q9h698g2f.apps.googleusercontent.com">
                    <ThemeProvider>
                      <LocationProvider>
                        <Navigation />
                      </LocationProvider>
                    </ThemeProvider>
                  </GoogleOAuthProvider>
                </AuthProvider>
              </LoadingProvider>
            </CategoryProvider>
          </NotificationProvider>
        </Provider>
      </ErrorBoundary>
    </>
  );
}

export default App;
