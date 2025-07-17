import React, { useEffect } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  useLocation,
} from "react-router-dom";
import Home from "../pages/home";
import Login from "../pages/auth/login";
import Signup from "../pages/auth/signup";
import ForgotPassword from "../pages/auth/forgotpassword";
import PasswordReset from "../pages/auth/passwordreset";
import VerifyEmail from "../pages/auth/verifyemail";
import PageNotFound from "../pages/util/pagenotfound";
import Header from "../components/header";
import Footer from "../components/footer";
import AvailableJobPostings from "../pages/availablejobposts";
import HelpCenter from "../pages/helpcenter";
import ArvicesProviders from "../pages/providers";
import Activities from "../pages/activities";
import CompleteProfile from "../pages/auth/completeprofile";

// Import pages

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    // Scroll window to the top whenever the route changes
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

function Navigation(): React.JSX.Element {
  return (
    <Router>
      <ScrollToTop />
      <NavigationContent />
    </Router>
  );
}

// Move useLocation inside a separate component inside Router
// How to implement page not found?
function NavigationContent() {
  return (
    <div className="overflow-x-auto">
      <Header />
      <Routes>
        <Route path="/" Component={Home} />
        {/* Auth Pages */}
        <Route path="/login" Component={Login} />
        <Route path="/signup" Component={Signup} />
        <Route path="/forgot-password" Component={ForgotPassword} />
        <Route path="/resetpassword" Component={PasswordReset} />
        <Route path="/verify-email" Component={VerifyEmail} />
        <Route path="/complete-profile" Component={CompleteProfile} />

        {/* App Functional Pages */}
        <Route path="/job-posting" Component={AvailableJobPostings} />
        <Route path="/service-providers" Component={ArvicesProviders} />
        <Route path="/activities" Component={Activities} />
        <Route path="/help-center" Component={HelpCenter} />

        {/* 404 Route - must be last */}
        <Route path="*" Component={PageNotFound} />
      </Routes>
      <Footer />
    </div>
  );
}

export default Navigation;
