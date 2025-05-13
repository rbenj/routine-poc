import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './views/Dashboard';
import PlanView from './views/PlanView';
import './App.css'

function App() {
  return (
    <Router>
      <div className="app">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/plan/:planName" element={<PlanView />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
