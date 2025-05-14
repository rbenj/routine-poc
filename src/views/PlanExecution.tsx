import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { plans } from '../data/plans';

const PlanExecution = () => {
  const { planName } = useParams();
  const plan = plans.find((p) => p.name === planName);
  const [currentTaskIndex, setCurrentTaskIndex] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState<number | null>(null);
  const [isPaused, setIsPaused] = useState(false);
  const [fieldValues] = useState<Record<string, number>>({});

  useEffect(() => {
    if (!plan || !plan.tasks[currentTaskIndex] || isPaused) return;

    const currentTask = plan.tasks[currentTaskIndex];
    let intervalId: number;

    if ('durationSec' in currentTask) {
      // Rest period
      setTimeRemaining(currentTask.durationSec);
      intervalId = window.setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev === null || prev <= 0) {
            clearInterval(intervalId);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      // Task with timer
      const timerField = currentTask.fields?.find(
        (f) => f.type === 'timer_down' || f.type === 'timer_up',
      );

      if (timerField) {
        const initialValue = fieldValues[timerField.name] ?? timerField.defaultValue;
        setTimeRemaining(initialValue);

        intervalId = window.setInterval(() => {
          setTimeRemaining((prev) => {
            if (prev === null) return null;
            const newValue = timerField.type === 'timer_down' ? prev - 1 : prev + 1;

            if (timerField.type === 'timer_down' && newValue <= 0) {
              clearInterval(intervalId);
              return 0;
            }
            return newValue;
          });
        }, 1000);
      }
    }

    return () => clearInterval(intervalId);
  }, [plan, currentTaskIndex, isPaused, fieldValues]);

  if (!plan) {
    return <div>Plan not found</div>;
  }

  const currentTask = plan.tasks[currentTaskIndex];

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(Math.abs(seconds) / 60);
    const remainingSeconds = Math.abs(seconds) % 60;
    const sign = seconds < 0 ? '-' : '';
    return `${sign}${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const handleNext = () => {
    if (currentTaskIndex < plan.tasks.length - 1) {
      setCurrentTaskIndex((prev) => prev + 1);
      setTimeRemaining(null);
    }
  };

  const handlePrevious = () => {
    if (currentTaskIndex > 0) {
      setCurrentTaskIndex((prev) => prev - 1);
      setTimeRemaining(null);
    }
  };

  const renderTask = () => {
    if ('durationSec' in currentTask) {
      return (
        <div className="task-card rest">
          <h3>Rest</h3>
          <div className="timer">{timeRemaining !== null && formatTime(timeRemaining)}</div>
        </div>
      );
    }

    return (
      <div className="task-card">
        <h3>{currentTask.name}</h3>
        {currentTask.fields?.map((field) => {
          const currentValue = fieldValues[field.name] ?? field.defaultValue;
          return (
            <div key={field.name} className="field">
              <label>{field.name}</label>
              {field.type === 'timer_down' || field.type === 'timer_up' ? (
                <div className="timer">{timeRemaining !== null && formatTime(timeRemaining)}</div>
              ) : (
                <div className="field-value">
                  {field.type === 'weight' && `${currentValue.toFixed(1)} kg`}
                  {field.type === 'distance' && `${(currentValue / 1000).toFixed(2)} km`}
                  {field.type === 'int' && currentValue}
                </div>
              )}
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="plan-execution">
      <Link to={`/plan/${encodeURIComponent(plan.name)}`} className="back-link">
        ← Back to Plan
      </Link>
      <h1>{plan.name}</h1>
      <div className="progress">
        Task {currentTaskIndex + 1} of {plan.tasks.length}
      </div>
      {renderTask()}
      <div className="execution-controls">
        <button onClick={handlePrevious} disabled={currentTaskIndex === 0}>
          Previous
        </button>
        <button onClick={() => setIsPaused(!isPaused)} className="pause-button">
          {isPaused ? 'Resume' : 'Pause'}
        </button>
        <button onClick={handleNext} disabled={currentTaskIndex === plan.tasks.length - 1}>
          Next
        </button>
      </div>
    </div>
  );
};

export default PlanExecution;
