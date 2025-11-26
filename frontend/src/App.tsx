import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ToastContainer } from 'react-toastify';
import { ActivityPage, ArchivePage, DashboardPage, EnergyPage, HomePage, LogInPage, ProfilePage, ProgramPage, SignUpPage,AddEnergyPage,RecordPage } from './pages';
import Header from "./components/Common/Header";
import { AuthProvider } from "./context/AuthProvider";

function AppContent() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<LogInPage />} />
      <Route path="/add" element={<AddEnergyPage />} />
      <Route path="/record" element={<RecordPage />} />
      <Route path="/signup" element={<SignUpPage />} />
      <Route path="/acts" element={<ActivityPage />} />
      <Route path="/energy" element={<EnergyPage />} />
      <Route path="/archive" element={<ArchivePage />} />
      <Route path="/dash" element={<DashboardPage />} />
      <Route path="/program" element={<ProgramPage />} />
      <Route path="/profile" element={<ProfilePage />} />
    </Routes>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <div>
          <Header />
          <AppContent />
          <ToastContainer
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
        </div>
      </Router>
    </AuthProvider>
  );
}


export default App;
