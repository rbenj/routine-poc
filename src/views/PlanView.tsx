import { useParams, Link } from 'react-router-dom';
import { plans } from '../data/plans';
import type { Task, Rest } from '../types';

const PlanView = () => {
    const { planName } = useParams();
    const plan = plans.find(p => p.name === planName);

    if (!plan) {
        return <div>Plan not found</div>;
    }

    const renderTask = (task: Task | Rest) => {
        if ('durationSec' in task) {
            return (
                <div key={`rest-${task.durationSec}`} className="task-card rest">
                    <h3>Rest</h3>
                    <p>{task.durationSec} seconds</p>
                </div>
            );
        }

        return (
            <div key={task.name} className="task-card">
                <h3>{task.name}</h3>
                {task.fields?.map((field) => (
                    <div key={field.name} className="field">
                        <label>{field.name}</label>
                        <div className="field-controls">
                            <button>-</button>
                            <span>{field.defaultValue}</span>
                            <button>+</button>
                        </div>
                    </div>
                ))}
            </div>
        );
    };

    return (
        <div className="plan-view">
            <Link to="/" className="back-link">
                ← Dashboard
            </Link>
            <h1>{plan.name}</h1>
            <div className="task-list">
                {plan.tasks.map(renderTask)}
            </div>
            <button className="execute-button">Execute Plan</button>
        </div>
    );
};

export default PlanView; 
