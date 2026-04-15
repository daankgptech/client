import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import AOS from "aos";
import "aos/dist/aos.css";
import { Toaster } from "sonner";

import Home from "./pages/Home";
import OurFam from "./pages/OurFam";
import AcademicStars from "./pages/AcademicStars";
import Events from "./pages/Events";
import EventsDetails from "./pages/EventsDetails";
import BeforeDAAN from "./pages/BeforeDAAN";
import AfterDAAN from "./pages/AfterDAAN";
import NoPage from "./pages/NoPage";
import FlashPage from "./pages/FlashPage";
import Forms from "./pages/Forms";
// import EventComp from "./components/Events/EventsComp";
import Toolkit from "./pages/Toolkit";
import Dashboard from "./pages/Dashboard";

import Navbar from "./components/Navbar/Navbar";
import Footer from "./components/Footer/Footer";
import PageUpBtn from "./utils/PageUpBtn";
import GlobalClickSpark from "./components/ClickEffect/GlobalClickSpark";
import NetworkDetector from "./components/NetworkDetector/NetworkDetector";

import { Analytics } from "@vercel/analytics/react"
import { SpeedInsights } from "@vercel/speed-insights/react";
import FormWrapper from "./components/Forms/FormWrapper";
import FamCardDetails from "./components/OurFam/FamCardDetails";
import SignOut from "./components/Secure/SignOut";
import ProtectedRoute from "./components/Secure/ProtectedRoute";
import ForgotPassword from "./components/Secure/ForgotPassword";
import SignIn from "./components/Secure/SignIn";
import Info from "./components/Secure/Info";
// import SignUp from "./components/Secure/SignUp";
import Profile from "./components/Secure/Profile";
import ScrollToTop from "./utils/ScrollToTop";
import Diary from "./components/Secure/Diary";
import useTracker from "./utils/useTracker";
import TrackDashboard from "./pages/TrackDashboard";
import SignUp from "./components/Secure/SignUp";
import OuterForgotPassword from "./components/Secure/OuterForgotPassword";

const scrollRoutes = ["flashing-notices", "cr", "council"];

const TrackerComponent = () => {
  useTracker();
  return null;
};

export default function App() {
  const [showFlash, setShowFlash] = useState(true);

  useEffect(() => {
    AOS.init({
      offset: 100,
      duration: 900,
      easing: "ease-in-sine",
      delay: 100,
    });
  }, []);

  useEffect(() => {
    if (sessionStorage.getItem("daanFlashShown")) setShowFlash(false);
    else sessionStorage.setItem("daanFlashShown", "true");
  }, []);

  if (showFlash) return <FlashPage onFinish={() => setShowFlash(false)} />;

  return (
    <BrowserRouter>
    <ScrollToTop/>
      <TrackerComponent />
      <Toaster 
        position="top-center"
        richColors
        closeButton
        theme="system"
        toastOptions={{
          style: {
            fontFamily: 'inherit',
            borderRadius: '12px',
          },
          classNames: {
            error: 'bg-red-50 dark:bg-red-950 text-red-600 dark:text-red-400 border-red-200 dark:border-red-800',
            success: 'bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800',
            warning: 'bg-amber-50 dark:bg-amber-950 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-800',
            info: 'bg-gray-50 dark:bg-gray-900 text-gray-600 dark:text-gray-400 border-gray-200 dark:border-gray-800',
          },
        }}
      />
      <Navbar />
      <main className="pt-0 bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-400 min-h-screen">
        <Routes>
          <Route index element={<Home />} />
          {scrollRoutes.map((path) => ( <Route key={path} path={path} element={<Home scrollTo={path} />} /> ))}
          <Route path="/our-fam" element={<OurFam />} />
          <Route path="/our-fam/:year" element={ <ProtectedRoute redirect> <OurFam /> </ProtectedRoute> }/>
          <Route path="/our-fam/:year/:name" element={ <ProtectedRoute redirect><FamCardDetails /> </ProtectedRoute> } />
          <Route path="/events" element={<Events />} />
          <Route path="/events/:slug" element={<EventsDetails />} />
          <Route path="/before" element={<BeforeDAAN />} />
          <Route path="/after" element={<AfterDAAN />} />
          <Route path="toolkit/:tab" element={<Toolkit />} />
          <Route path="toolkit" element={<Navigate to="/toolkit/erp" replace />} />
          <Route path="academic-stars" element={<AcademicStars />} />
          <Route path="/forms" element={<Forms />} />
          <Route path="forms/:name" element={<FormWrapper />} />
          {/* <Route path="/signup" element={<SignUp />} /> */}
          <Route path="/signup" element={<Info />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/forgot-password" element={ <ProtectedRoute redirect> <ForgotPassword /> </ProtectedRoute> } />
          <Route path="/outer-forgot-password" element={ <OuterForgotPassword /> } />
          <Route path="/profile" element={ <ProtectedRoute redirect> <Profile /> </ProtectedRoute> } />
          <Route path="/dashboard" element={ <ProtectedRoute redirect> <Dashboard /> </ProtectedRoute> } />
          <Route path="/diary" element={ <ProtectedRoute redirect> <Diary /> </ProtectedRoute> } />
          {/* <Route path="/dashboard" element={<Dashboard/>}/> */}
          <Route path="/track" element={ <ProtectedRoute redirect> <TrackDashboard /> </ProtectedRoute> } />
          <Route path="/signout" element={<SignOut /> } />
          {/* <Route path="*" element={<FlashPage />} /> */}
          <Route path="*" element={<NoPage />} />
        </Routes>
      </main>
      <PageUpBtn />
      <Analytics />
      <SpeedInsights />
      <Footer />
      <GlobalClickSpark />
      <NetworkDetector />
    </BrowserRouter>
  );
}
