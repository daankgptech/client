import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import AOS from "aos";
import "aos/dist/aos.css";
import { Toaster } from "react-hot-toast";

import Home from "./pages/Home";
import OurFam from "./pages/OurFam";
import AcademicStars from "./pages/AcademicStars";
import EventsDetails from "./pages/EventsDetails";
import NoPage from "./pages/NoPage";
import FlashPage from "./pages/FlashPage";
import Forms from "./pages/Forms";
import EventComp from "./components/Events/EventsComp";
import Toolkit from "./pages/Toolkit";
import Dashboard from "./pages/Dashboard";

import Navbar from "./components/Navbar/Navbar";
import Footer from "./components/Footer/Footer";
import PageUpBtn from "./utils/PageUpBtn";
import GlobalClickSpark from "./components/ClickEffect/GlobalClickSpark";

import { Analytics } from "@vercel/analytics/react"
import { SpeedInsights } from "@vercel/speed-insights/react";
import Feature from "./components/Forms/Feature";
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

const scrollRoutes = ["flashing-notices", "cr", "council", "events"];

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
      <Toaster position="top-center"/>
      <Navbar />
      <main className="pb-8 pt-0 bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-400 min-h-screen">
        <Routes>
          <Route index element={<Home />} />
          {scrollRoutes.map((path) => ( <Route key={path} path={path} element={<Home scrollTo={path} />} /> ))}
          <Route path="/our-fam" element={<OurFam />} />
          <Route path="/our-fam/:year" element={ <ProtectedRoute redirect> <OurFam /> </ProtectedRoute> }/>
          <Route path="/our-fam/:year/:name" element={ <ProtectedRoute redirect><FamCardDetails /> </ProtectedRoute> } />
          <Route path="events" element={<EventComp />} />
          <Route path="events/:slug" element={<EventsDetails />} />
          <Route path="toolkit/:tab" element={<Toolkit />} />
          <Route path="toolkit" element={<Navigate to="/toolkit/erp" replace />} />
          <Route path="academic-stars" element={<AcademicStars />} />
          <Route path="/forms" element={<ProtectedRoute redirect> <Forms /></ProtectedRoute>} />
          <Route path="forms/feature" element={<ProtectedRoute redirect> <Feature /></ProtectedRoute>} />
          {/* <Route path="/signup" element={<SignUp />} /> */}
          <Route path="/signup" element={<Info />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/profile" element={ <ProtectedRoute redirect> <Profile /> </ProtectedRoute> } />
          <Route path="/dashboard" element={ <ProtectedRoute redirect> <Dashboard /> </ProtectedRoute> } />
          <Route path="/diary" element={ <ProtectedRoute redirect> <Diary /> </ProtectedRoute> } />
          {/* <Route path="/dashboard" element={<Dashboard/>}/> */}
          <Route path="/signout" element={<SignOut /> } />
          <Route path="*" element={<NoPage />} />
        </Routes>
      </main>
      <PageUpBtn />
      <Analytics />
      <SpeedInsights />
      <Footer />
      <GlobalClickSpark />
    </BrowserRouter>
  );
}
