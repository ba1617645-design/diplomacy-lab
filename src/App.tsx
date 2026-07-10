import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AppProvider } from './store/AppContext';
import Layout from './components/Layout';
import Home from './components/Home';
import Register from './components/Register';
import Login from './components/Login';
import InfluenceMission from './components/Day1/InfluenceMission';
import StorytellingWizard from './components/Day2/StorytellingWizard';
import NegotiationSimulation from './components/Day3/NegotiationSimulation';
import ImpactCanvas from './components/Day4/ImpactCanvas';
import ImpactEngineering from './components/Day5/ImpactEngineering';
import TrainerDashboard from './components/Dashboard/TrainerDashboard';
import ProfilePage from './components/Dashboard/ProfilePage';
import ParticipantsList from './components/Dashboard/ParticipantsList';

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter basename={import.meta.env.BASE_URL.replace(/\/$/, '')}>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="register" element={<Register />} />
            <Route path="login" element={<Login />} />
            <Route path="day1" element={<InfluenceMission />} />
            <Route path="day2" element={<StorytellingWizard />} />
            <Route path="day3" element={<NegotiationSimulation />} />
            <Route path="day4" element={<ImpactCanvas />} />
            <Route path="day5" element={<ImpactEngineering />} />
            <Route path="trainer" element={<TrainerDashboard />} />
            <Route path="profile" element={<ProfilePage />} />
            <Route path="participants" element={<ParticipantsList />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AppProvider>
  );
}
