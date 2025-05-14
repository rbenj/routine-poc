import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './views/Dashboard';
import PlanView from './views/PlanView';
import PlanExecution from './views/PlanExecution';
import './App.css'

function App() {
  return (
    <Router>
      <div className="app">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/plan/:planName" element={<PlanView />} />
          <Route path="/plan/:planName/execute" element={<PlanExecution />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
