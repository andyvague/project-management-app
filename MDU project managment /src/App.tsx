
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import CssBaseline from '@mui/material/CssBaseline';
import { Box } from '@mui/material';

// Components
import Layout from './components/Layout/Layout';
import Dashboard from './pages/Dashboard/Dashboard';
import Buildings from './pages/Buildings/Buildings';
import BuildingDetail from './pages/BuildingDetail/BuildingDetail';
import Tasks from './pages/Tasks/Tasks';
import Documents from './pages/Documents/Documents';
import Schedule from './pages/Schedule/Schedule';

// Context
import { ThemeProvider } from './context/ThemeContext';
import { UserProvider } from './context/UserContext';
import { BuildingProvider } from './context/BuildingContext';
import { TaskProvider } from './context/TaskContext';
import { DocumentProvider } from './context/DocumentContext';
import { ScheduleProvider } from './context/ScheduleContext';
import { MonkeyProvider } from './context/MonkeyContext';

function App() {
  return (
    <ThemeProvider>
      <CssBaseline />
            <UserProvider>
        <BuildingProvider>
          <TaskProvider>
            <DocumentProvider>
              <ScheduleProvider>
                <MonkeyProvider>
                  <Router>
                    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
                      <Layout>
                        <Routes>
                          <Route path="/" element={<Dashboard />} />
                          <Route path="/buildings" element={<Buildings />} />
                          <Route path="/buildings/:id" element={<BuildingDetail />} />
                          <Route path="/tasks" element={<Tasks />} />
                          <Route path="/documents" element={<Documents />} />
                          <Route path="/schedule" element={<Schedule />} />
                        </Routes>
                      </Layout>
                    </Box>
                  </Router>
                </MonkeyProvider>
              </ScheduleProvider>
            </DocumentProvider>
          </TaskProvider>
        </BuildingProvider>
      </UserProvider>
    </ThemeProvider>
  );
}

export default App;
