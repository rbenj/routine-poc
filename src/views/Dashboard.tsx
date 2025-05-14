import { Link } from 'react-router-dom';
import { plans } from '../data/plans';

const Dashboard = () => {
  return (
    <div className="dashboard">
      <h1>Practice Plans</h1>
      <div className="plan-list">
        {plans.map((plan) => (
          <Link key={plan.name} to={`/plan/${encodeURIComponent(plan.name)}`} className="plan-card">
            <h2>{plan.name}</h2>
            <p>{plan.tasks.length} tasks</p>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
