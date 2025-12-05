import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { ActivityPage, ArchivePage, DashboardPage, EnergyPage, HomePage, LogInPage, ProfilePage, ProgramPage, SignUpPage, AddEnergyPage, RecordPage, RecordBehavePage } from './pages';
import Header from "./components/Common/Header";
import { AuthProvider } from "./context/AuthProvider";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function AppContent() {
  return (<Routes>
    <Route path="/" element={<HomePage />} />
    <Route path="/login" element={<LogInPage />} />
    <Route path="/add" element={<AddEnergyPage />} />
    <Route path="/record" element={<RecordPage />} />
    <Route path="/recordb" element={<RecordBehavePage />} />
    <Route path="/signup" element={<SignUpPage />} />
    <Route path="/acts" element={<ActivityPage />} />
    <Route path="/energy" element={<EnergyPage />} />
    <Route path="/archive" element={<ArchivePage />} />
    <Route path="/dash" element={<DashboardPage />} />
    <Route path="/program" element={<ProgramPage />} />
    <Route path="/profile" element={<ProfilePage />} /> </Routes>
  );
}

// Router 안쪽에서 useNavigate 사용
function AppInner() {
  const navigate = useNavigate();

  useEffect(() => {
    const handleForceLogout = () => navigate("/login");
    window.addEventListener("forceLogout", handleForceLogout);
    return () => window.removeEventListener("forceLogout", handleForceLogout);
  }, [navigate]);

  return (
    <> <Header /> <AppContent /> <ToastContainer
      aria-label="notification toaster"
      position="top-right"
      autoClose={1500}
      hideProgressBar={false}
      newestOnTop={false}
      closeOnClick
      rtl={false}
      pauseOnFocusLoss
      draggable
      pauseOnHover
    />
    </>
  );
}

function App() {
  return (<Router> <AuthProvider> <AppInner /> </AuthProvider> </Router>
  );
}

export default App;
