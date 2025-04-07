import React, { useState, useEffect, lazy } from "react";
import { Routes, Route, BrowserRouter } from "react-router";
import { pdfjs } from "react-pdf";
import Login from "./pages/Login";
import Form from "./pages/Form";
import Report from "./pages/Report";
import Dashboard from "./pages/Dashboard";
import HomeLayout from "./layout/HomeLayout";
import PageNotFound from "./pages/PageNotFound";
import ValidateRoute from "./primitives/ValidateRoute";
import Validate from "./primitives/Validate";
import TemplatePlaceholder from "./pages/TemplatePlaceholder";
import SignYourSelf from "./pages/SignyourselfPdf";
import DraftDocument from "./components/pdf/DraftDocument";
import PlaceHolderSign from "./pages/PlaceHolderSign";
import PdfRequestFiles from "./pages/PdfRequestFiles";
import LazyPage from "./primitives/LazyPage";
import Loader from "./primitives/Loader";
import UserList from "./pages/UserList";
import { serverUrl_fn } from "./constant/appinfo";
import DocSuccessPage from "./pages/DocSuccessPage";
import Transaction from "./pages/Transaction";
import SignUp from "./pages/Signup";
import Wallet from "./pages/Wallet";
import MonthlyBills from "./pages/MonthlyBills";
import { useSelector, useDispatch } from "react-redux";
import { setPaymentMode } from "./redux/reducers/PaymentReducer";
import Website from "./website/Website";
import Home from "./website/Pages/Home";
import Policy from "./website/Pages/Policy";
import Refund from "./website/Pages/Refund";
import Contact from "./website/components/Contact";
import ServiceAndDelivery from "./website/Pages/ServiceAndDelivery";
import Terms from "./website/Pages/Terms";
import Faq from "./website/components/FAQ";
const DebugPdf = lazy(() => import("./pages/DebugPdf"));
const ForgetPassword = lazy(() => import("./pages/ForgetPassword"));
const GuestLogin = lazy(() => import("./pages/GuestLogin"));
const ChangePassword = lazy(() => import("./pages/ChangePassword"));
const UserProfile = lazy(() => import("./pages/UserProfile"));
const Opensigndrive = lazy(() => import("./pages/Opensigndrive"));
const ManageSign = lazy(() => import("./pages/Managesign"));
const AddAdmin = lazy(() => import("./pages/AddAdmin"));
const UpdateExistUserAdmin = lazy(() => import("./pages/UpdateExistUserAdmin"));
const Preferences = lazy(() => import("./pages/Preferences"));
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/legacy/build/pdf.worker.min.mjs`;
const AppLoader = () => {
  return (
    <div className="flex justify-center items-center h-[100vh]">
      <Loader />
    </div>
  );
};
function App() {
  const [isloading, setIsLoading] = useState(true);
  const dispatch = useDispatch();
  const paymentMode = useSelector((state) => state.payment.mode);

  useEffect(() => {
    const storedPaymentMode = localStorage.getItem('paymentMode');
    if (storedPaymentMode !== null) {
      dispatch(setPaymentMode(storedPaymentMode === 'true'));
    }
    handleCredentials();
  }, [dispatch]);

  const handleCredentials = () => {
    const appId = process.env.REACT_APP_APPID
      ? process.env.REACT_APP_APPID
      : "Instasign";
    const baseurl = serverUrl_fn();
    try {
      localStorage.setItem("baseUrl", `${baseurl}/`);
      localStorage.setItem("parseAppId", appId);
      setIsLoading(false);
    } catch (error) {
      console.log("err ", error);
    }
  };

  return (
    <div className="bg-base-200">
      {isloading ? (
        <AppLoader />
      ) : (
        <BrowserRouter>
          <Routes>
          <Route path="/" element={<Website/>}>
              <Route index element={<Home/>} />
              <Route path="policy" element={<Policy/>} />
              <Route path="terms" element={<Terms/>} />
              <Route path="service" element={<ServiceAndDelivery/>} />
              <Route path="refund" element={<Refund/>} />
              <Route path="contact" element={<Contact/>} />
              <Route path="faq" element={<Faq/>} />
            </Route>
            <Route element={<ValidateRoute />}>
              <Route exact path="/login" element={<Login />} />
                  <Route
                    path="/addadmin"
                    element={<LazyPage Page={AddAdmin} />}
                  />
                  <Route
                    path="/upgrade-2.1"
                    element={<LazyPage Page={UpdateExistUserAdmin} />}
                  />
                  <Route path="/signup" element={<LazyPage Page={SignUp} />} />
            </Route>
            <Route element={<Validate />}>
              <Route
                path="/load/template/:templateId"
                element={<TemplatePlaceholder />}
              />
              <Route
                exact
                path="/load/placeholdersign/:docId"
                element={<PlaceHolderSign />}
              />
              <Route
                exact
                path="/load/recipientSignPdf/:docId/:contactBookId"
                element={<PdfRequestFiles />}
              />
            </Route>
            <Route
              path="/loadmf/signmicroapp/login/:id/:userMail/:contactBookId/:serverUrl"
              element={<LazyPage Page={GuestLogin} />}
            />
            <Route
              path="/login/:id/:userMail/:contactBookId/:serverUrl"
              element={<LazyPage Page={GuestLogin} />}
            />
            <Route
              path="/login/:base64url"
              element={<LazyPage Page={GuestLogin} />}
            />
            <Route path="/debugpdf" element={<LazyPage Page={DebugPdf} />} />
            <Route
              path="/forgetpassword"
              element={<LazyPage Page={ForgetPassword} />}
            />
            <Route element={<HomeLayout />}>
              <Route
                path="/changepassword"
                element={<LazyPage Page={ChangePassword} />}
              />
              <Route path="/form/:id" element={<Form />} />
              {!paymentMode && (
                <Route path="/wallet" element={<Wallet />} />
              )}
              {/* <Route path="/transaction" element={<PageNotFound/>} /> */}
              <Route path="/report/:id" element={<Report />} />
              <Route path="/dashboard/:id" element={<Dashboard />} />
              <Route path="/transaction" element={<Transaction/>} />
              
              {paymentMode && (
                <Route path="/monthlybills" element={<MonthlyBills/>} />
              )}
              <Route
                path="/profile"
                element={<LazyPage Page={UserProfile} />}
              />
              <Route
                path="/mydrive"
                element={<LazyPage Page={Opensigndrive} />}
              />
              <Route
                path="/managesign"
                element={<LazyPage Page={ManageSign} />}
              />
              <Route
                path="/template/:templateId"
                element={<TemplatePlaceholder />}
              />
              {/* signyouself route with no rowlevel data using docId from url */}
              <Route path="/signaturePdf/:docId" element={<SignYourSelf />} />
              {/* draft document route to handle and navigate route page accordiing to document status */}
              <Route path="/draftDocument" element={<DraftDocument />} />
              {/* recipient placeholder set route with no rowlevel data using docId from url*/}
              <Route
                path="/placeHolderSign/:docId"
                element={<PlaceHolderSign />}
              />
              {/* for user signature (need your sign route) with row level data */}
              <Route path="/pdfRequestFiles" element={<PdfRequestFiles />} />
              {/* for user signature (need your sign route) with no row level data */}
              <Route
                path="/pdfRequestFiles/:docId"
                element={<PdfRequestFiles />}
              />
              {/* recipient signature route with no rowlevel data using docId from url */}
              <Route
                path="/recipientSignPdf/:docId/:contactBookId"
                element={<PdfRequestFiles />}
              />
              <Route
                path="/recipientSignPdf/:docId"
                element={<PdfRequestFiles />}
              />
              <Route path="/users" element={<UserList />} />
              <Route
                path="/preferences"
                element={<LazyPage Page={Preferences} />}
              />
            </Route>
            <Route path="/success" element={<DocSuccessPage />} />
 
            <Route path="*" element={<PageNotFound />} />
          </Routes>
        </BrowserRouter>
      )}
    </div>
  );
}

export default App;
