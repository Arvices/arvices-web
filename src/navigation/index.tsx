import React, { useEffect } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  useLocation,
} from "react-router-dom";
import Home from "../pages/home";
import Login from "../pages/auth/login";
import BookingsPage from "../pages/bookings/BookingsPage";
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
import NewJobPosting from "../pages/newjobposting";
import Profile from "../pages/profile";
import Notification from "../pages/notification";
import Conversations from "../pages/messaging";
import ChatPage from "../pages/messaging/chatpage";
import PostShowcase from "../pages/postshowcase";
import Wallet from "../pages/wallet";
import Transactions from "../pages/transactionhistory";
import BaseLayout from "../pages/base";
import { ProfileEdit } from "../pages/profile/profile.edit";
import ManageJob from "../pages/jobs&negotiations";
import JobView from "../pages/jobs&negotiations/jobview";
import { useAuth } from "../contexts/AuthContext";
import { getAccountById } from "../api-services/auth-re";
import { useDispatch } from "react-redux";
import { updateProfile } from "../store/userSlice";

const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
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
function NavigationContent() {
  const location = useLocation();
  const isChat = location.pathname.includes("conversations");
  const isShowcase = location.pathname.includes("activities");

  const auth = useAuth();
  const dispatch = useDispatch();

  const fetchUser = async () => {
    try {
      const response = await getAccountById(
        String(auth?.user?.id),
        auth?.token,
      );

      console.log("User response:", response);

      if (response?.data?.response) {
        dispatch(updateProfile(response.data.response));
      }
    } catch (error) {
      console.error("Failed to fetch user:", error);
    }
  };

  useEffect(() => {
    if (auth?.isAuthenticated && auth?.user?.id) {
      fetchUser();
    }
  }, [auth?.isAuthenticated, auth?.user?.id]);

  return (
    <div className="overflow-x-auto  text-royalblue-shade6 ">
      <Header />
      <Routes>
        <Route path="/" Component={Home} />
        {}
        <Route path="/login" Component={Login} />
        <Route path="/signup" Component={Signup} />
        <Route path="/forgot-password" Component={ForgotPassword} />
        <Route path="/resetpassword" Component={PasswordReset} />
        <Route path="/verify-email" Component={VerifyEmail} />
        <Route path="/complete-profile" Component={CompleteProfile} />

        {}
        <Route path="/job-posting" Component={AvailableJobPostings} />
        <Route path="/service-providers" Component={ArvicesProviders} />
        <Route path="/activities" Component={Activities} />
        <Route path="/help-center" Component={HelpCenter} />
        <Route path="/user-profile/:id" Component={Profile} />
        <Route path="/myprofile" Component={Profile} />
        <Route path="/profile/edit" Component={ProfileEdit} />
        <Route path="/notifications" Component={Notification} />
        <Route path="/messaging/conversations" Component={Conversations} />
        <Route path="/messaging/chat" Component={ChatPage} />
        <Route path="/post-showcase" Component={PostShowcase} />
        <Route path="/wallet" Component={Wallet} />
        <Route path="/transaction-history" Component={Transactions} />
        <Route path="/bookings" Component={BookingsPage} />
        <Route path="/jobs" Component={Transactions} />
        <Route path="/provider/manage-jobs" Component={ManageJob} />
        <Route path="/client/manage-jobs" Component={ManageJob} />
        <Route path="/provider/manage-jobs/:id/:offerId" Component={JobView} />
        <Route path="/client/manage-jobs/:id" Component={JobView} />
        <Route path="/client/new-job" Component={NewJobPosting} />
        <Route
          path="/client/favourite-service-providers"
          Component={BaseLayout}
        />
        <Route path="/provider/open-offers" Component={BaseLayout} />
        <Route path="/provider/open-offers" Component={BaseLayout} />

        <Route path="*" Component={PageNotFound} />
      </Routes>
      {!isChat && !isShowcase && <Footer />}
    </div>
  );
}
export default Navigation;
