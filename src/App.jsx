import React, { Suspense, lazy } from "react";
import { Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { ClipLoader } from "react-spinners";
import CancellationPolicy from "./Components/CancellationPolicy/CancellationPolicy";
import { ChatProvider } from "./context/ChatContext";
import { Toaster } from "react-hot-toast";
import AdminProtectedRoute from "./Components/Routes/ProtectedRoute/AdminProtectRoute";

// Lazy load layouts
const MainLayout = lazy(() => import("./layouts/MainLayout"));
const AuthLayout = lazy(() => import("./layouts/AuthLayout"));
const PlayerDashboardLayout = lazy(() => import("./layouts/PlayerDashBoard"));
const CoachDashBoardLayout = lazy(() => import("./layouts/CoachDashBoard"));
const StoreLayout = lazy(() => import("./Components/StoreLayout/StoreLayout"));
const ParentDashboardLayout = lazy(() => import("./layouts/ParentDashBoard"));

// Lazy load routes
const ProtectedRoute = lazy(() =>
  import("./Components/Routes/ProtectedRoute/ProtectedRoute")
);
const DynamicRoute = lazy(() =>
  import("./Components/Routes/DynamicRoute/DynamicRoute")
);
const AuthRoutes = lazy(() => import("./Components/Routes/Auth/AuthRoutes"));

// Lazy load pages
const Home = lazy(() => import("./pages/Home/Home"));
const Session = lazy(() => import("./pages/Session/Sessions"));
const SessionPage = lazy(() => import("./pages/Session/SessionsPage"));
const Blogs = lazy(() => import("./pages/Blogs/Blogs"));
const CoachDetail = lazy(() => import("./pages/Session/CoachDetail"));
const Blogdetail = lazy(() => import("./pages/Blogs/Blogdetail"));
const ContactUs = lazy(() => import("./pages/Contact/ContactUs"));
const AboutPage = lazy(() => import("./Components/About/AboutPage"));
const CoachesPage = lazy(() => import("./pages/Coaches/CoachesPage"));
const StorePage = lazy(() => import("./pages/Store/StorePage"));
const AgencyPage = lazy(() => import("./pages/Agency/AgencyPage"));
const BookingPage = lazy(() => import("./pages/Coaches/BookingPage"));
const BookingConfirmation = lazy(() => import("./pages/Coaches/BookComfirm"));
const ForgotPasswordPage = lazy(() => import("./pages/Auth/forgetpassword"));
const ManageSessions = lazy(() =>
  import("./pages/Manage Session/ManageSessions")
);
const AddSession = lazy(() => import("./pages/Manage Session/AddSession"));
const EditSession = lazy(() => import("./pages/Manage Session/EditSession"));
const AddProfile = lazy(() => import("./modules/Coach/AddProfile/AddProfile"));
const PlayerProfile = lazy(() =>
  import("./modules/Player/Dashbaord/AddProfile/PlayerProfile")
);
const SearchedSessions = lazy(() =>
  import("./pages/SearchedSessions/SearchedSessions")
);
const StoreCategory = lazy(() =>
  import("./Components/StoreLayout/StoreCategory")
);
const ProductDetails = lazy(() =>
  import("./Components/StoreLayout/ProductDetails")
);
const SafeGuardPolicy = lazy(() =>
  import("./pages/PolicyPages/SafeguardingPolicy/SafeGuardPolicy")
);
const EqualityPolicy = lazy(() =>
  import("./pages/PolicyPages/EqualityPolicy/EqualityPolicy")
);
const CookiesPolicy = lazy(() =>
  import("./pages/PolicyPages/CookiesPolicy/CookiesPolicy")
);
const Basket = lazy(() => import("./pages/StoreBasket/Basket"));
const PlayerDashBoard = lazy(() => import("./modules/Player"));
const CoachDashBoard = lazy(() => import("./modules/Coach"));
const Success = lazy(() => import("./pages/CheckoutSuccess/Success"));
const CheckoutFailure = lazy(() =>
  import("./pages/CheckoutFailure/CheckoutFailure")
);
const AdminDashboard = lazy(() => import("./modules/Admin"));
const AdminLogin = lazy(() =>
  import("./Components/AdminDashboard/AdminLogin/AdminLogin")
);
const CoachServices = lazy(() =>
  import("./Components/CoachServises/CoachServices")
);
const Checkout = lazy(() => import("./pages/Checkout"));
const FAQs = lazy(() => import("./pages/Faqs"));
const CoachProfile = lazy(() => import("./pages/CoachProfile/CoachProfile"));
const SessionDetails = lazy(() =>
  import("./pages/Manage Session/SessionProfileDetails")
);
const ParentDashBoard = lazy(() => import("./modules/Parent"));

const App = () => {
  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      <Toaster position="top-center" />
      <Suspense
        fallback={
          <div className="flex justify-center items-center h-screen">
            <ClipLoader color="#FEB7DC" size={45} />
          </div>
        }
      >
        <ChatProvider>
          <Routes>
            <Route element={<MainLayout />}>
              <Route path="/" element={<Home />} />
              <Route path="/contact-us" element={<ContactUs />} />
              <Route path="/about-us" element={<AboutPage />} />
              <Route path="/coaches" element={<CoachesPage />} />
              <Route path="/faqs" element={<FAQs />} />
              <Route path="/checkout/:id" element={<Checkout />} />
              <Route
                path="/session/:abc"
                element={<DynamicRoute component={Session} />}
              />
              <Route
                path="/sessiondetails"
                element={<DynamicRoute component={SessionPage} />}
              />
              <Route path="/blogs" element={<Blogs />} />
              <Route
                path="/coachdetail/:coachId"
                element={<DynamicRoute component={CoachDetail} />}
              />
              <Route
                path="/coachProfile/:coachId"
                element={<DynamicRoute component={CoachProfile} />}
              />
              <Route
                path="/blogdetail/:blogId"
                element={<DynamicRoute component={Blogdetail} />}
              />
              <Route
                path="/session-profile-details"
                element={<SessionDetails />}
              />
              <Route path="/booking/:coachId" element={<BookingPage />} />
              <Route path="/confirmbooking" element={<BookingConfirmation />} />
              <Route path="/agency" element={<AgencyPage />} />
              <Route path="/safeguard" element={<SafeGuardPolicy />} />
              <Route path="/equality" element={<EqualityPolicy />} />
              <Route
                path="/CancellationPolicy"
                element={<CancellationPolicy />}
              />
              <Route path="/cookies" element={<CookiesPolicy />} />
              <Route path="/managesession" element={<ManageSessions />} />
              <Route path="/addsession" element={<AddSession />} />
              <Route path="/editsession/:id" element={<EditSession />} />
              <Route path="/addprofile" element={<AddProfile />} />
              <Route path="/playerprofile" element={<PlayerProfile />} />
              <Route path="/searchedsession" element={<SearchedSessions />} />
              <Route path="/how-it-works" element={<CoachServices />} />
              <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            </Route>
            <Route element={<StoreLayout />}>
              <Route path="/store" element={<StorePage />} />
              <Route
                path="/shirt"
                element={<StoreCategory category="shirt" />}
              />
              <Route
                path="/shoes"
                element={<StoreCategory category="shoes" />}
              />
              <Route path="/kit" element={<StoreCategory category="kit" />} />
              <Route path="/pant" element={<StoreCategory category="pant" />} />
              <Route
                path="/gloves"
                element={<StoreCategory category="gloves" />}
              />
              <Route path="/productdetails/:id" element={<ProductDetails />} />
              <Route path="/basket" element={<Basket />} />
              <Route path="/successpage" element={<Success />} />
              <Route path="/failurepage" element={<CheckoutFailure />} />
            </Route>
            <Route element={<AuthLayout />}>
              <Route path="/*" element={<AuthRoutes />} />
            </Route>

            {/* Player-login dashboard */}
            <Route element={<PlayerDashboardLayout />}>
              <Route element={<ProtectedRoute />}>
                <Route path="/player-dashboard" element={<PlayerDashBoard />} />
              </Route>
            </Route>

            {/* Parent-login dashboard */}
            <Route element={<ParentDashboardLayout />}>
              <Route element={<ProtectedRoute />}>
                <Route path="/parent-dashboard" element={<ParentDashBoard />} />
              </Route>
            </Route>

            {/* Coach-login dashboard */}
            <Route element={<CoachDashBoardLayout />}>
              <Route element={<ProtectedRoute />}>
                <Route path="/coach-dashboard" element={<CoachDashBoard />} />
              </Route>
            </Route>
            {/* <Route element={<ProtectedRoute />}> */}
            <Route path="/admin-login" element={<AdminLogin />} />
            <Route element={<AdminProtectedRoute />}>
              <Route path="/admin/*" element={<AdminDashboard />} />
            </Route>
            {/* </Route> */}
          </Routes>
        </ChatProvider>
      </Suspense>
    </>
  );
};

export default App;
