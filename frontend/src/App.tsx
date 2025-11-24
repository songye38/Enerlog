import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ToastContainer } from 'react-toastify';
import {ActivityPage,ArchivePage,DashboardPage,EnergyPage,HomePage,LogInPage,ProfilePage,ProgramPage,SignUpPage} from './pages'



function AppContent() {
  return (
    <Router>

      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LogInPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/acts" element={<ActivityPage />} />
        <Route path="/energy" element={<EnergyPage />} />
        <Route path="/archive" element={<ArchivePage />} />
        <Route path="/dash" element={<DashboardPage />} />
        <Route path="/program" element={<ProgramPage />} />
        <Route path="/profile" element={<ProfilePage />} />


        {/* <Route path="/make/:id" element={<DragDropPage sessions={Object.values(sessionTexts)} />} />
        <Route path="/update/:id" element={<UpdatePomodoroPage sessions={Object.values(sessionTexts)} />} />
        <Route path="/pomo/:id" element={<PomodoroPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/summary/:logId" element={<PomodoroSummaryPage />} /> */}
      </Routes>

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
    </Router>
  );
}

function App() {
  return (
    // <AuthProvider>
      <div>
        <AppContent />
      </div>
    // </AuthProvider>
  );
}

export default App;
