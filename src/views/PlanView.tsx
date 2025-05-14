import { useParams, Link } from 'react-router-dom';
import { useState, useEffect, useCallback, useRef } from 'react';
import { plans } from '../data/plans';
import type { Task, Rest, Field } from '../types';

const PlanView = () => {
    const { planName } = useParams();
    const plan = plans.find(p => p.name === planName);
    const [fieldValues, setFieldValues] = useState<Record<string, number>>({});
    const [isExecuting, setIsExecuting] = useState(false);
    const [currentTaskIndex, setCurrentTaskIndex] = useState(0);
    const [timeRemaining, setTimeRemaining] = useState<number | null>(null);
    const [isPaused, setIsPaused] = useState(false);
    const [activeTaskIndex, setActiveTaskIndex] = useState<number | null>(null);
    const activeIntervalIdRef = useRef<number | null>(null);
    const [stoppedTimerTaskIndex, setStoppedTimerTaskIndex] = useState<number | null>(null);
    const [initialPlanDuration, setInitialPlanDuration] = useState<number | null>(null);
    const [currentPlanTimeRemaining, setCurrentPlanTimeRemaining] = useState<number | null>(null);

    const handleNext = useCallback(() => {
        if (plan && currentTaskIndex < plan.tasks.length - 1) {
            setActiveTaskIndex(null);
            setCurrentTaskIndex(prev => prev + 1);
            setTimeRemaining(null);
            setIsPaused(false);
            setStoppedTimerTaskIndex(null);
        }
    }, [plan, currentTaskIndex]);

    // Load saved field values from localStorage on mount
    useEffect(() => {
        if (!plan) return;
        const savedValues: Record<string, number> = {};
        const taskCounts: Record<string, number> = {};

        plan.tasks.forEach((task) => {
            if (task.type === 'task' && task.fields) {
                const taskName = task.name;
                const count = (taskCounts[taskName] || 0) + 1;
                taskCounts[taskName] = count;

                task.fields.forEach(field => {
                    if (field.initialValueSource === 'memory') {
                        const storageKey = `${taskName}-${count}-${field.name}`;
                        const savedValue = localStorage.getItem(storageKey);
                        if (savedValue !== null) {
                            savedValues[storageKey] = parseFloat(savedValue);
                        }
                    }
                });
            }
        });
        setFieldValues(savedValues);
    }, [plan]);

    // Save field values to localStorage when they change
    useEffect(() => {
        if (!plan) return;
        const taskCounts: Record<string, number> = {};
        plan.tasks.forEach((task) => {
            if (task.type === 'task' && task.fields) {
                const taskName = task.name;
                const count = (taskCounts[taskName] || 0) + 1;
                taskCounts[taskName] = count;

                task.fields.forEach(field => {
                    if (field.initialValueSource === 'memory') {
                        const storageKey = `${taskName}-${count}-${field.name}`;
                        const value = fieldValues[storageKey];
                        if (value !== undefined) {
                            localStorage.setItem(storageKey, value.toString());
                        }
                    }
                });
            }
        });
    }, [fieldValues, plan]);

    // useEffect to update currentPlanTimeRemaining (MOVED TO TOP LEVEL)
    useEffect(() => {
        if (!isExecuting || !plan || currentTaskIndex === null) {
            // Optionally, reset if not executing, though stopExecution handles it.
            // if (!isExecuting) {
            //     setCurrentPlanTimeRemaining(null);
            //     setInitialPlanDuration(null);
            // }
            return;
        }

        let sumRemaining = 0;
        for (let i = currentTaskIndex; i < plan.tasks.length; i++) {
            const item = plan.tasks[i];
            if (item.type === 'task') {
                sumRemaining += item.estimatedTimeSec || 0;
            } else { // rest
                sumRemaining += item.durationSec || 0;
            }
        }
        setCurrentPlanTimeRemaining(sumRemaining);

    }, [isExecuting, currentTaskIndex, plan]);

    useEffect(() => {
        // 1. Cleanup previous interval if any, before setting a new one.
        if (activeIntervalIdRef.current !== null) {
            clearInterval(activeIntervalIdRef.current);
            activeIntervalIdRef.current = null;
        }

        if (!isExecuting || !plan || isPaused) {
            return; // Conditions not met for a timer
        }

        const currentTask = plan.tasks[currentTaskIndex];
        let newIntervalId: number | undefined = undefined; // ID of interval set in *this* run

        if (currentTask.type === 'rest') {
            if (timeRemaining === null) setTimeRemaining(currentTask.durationSec);
            newIntervalId = window.setInterval(() => {
                setTimeRemaining(prev => {
                    if (prev === null) return null;
                    if (prev <= 1) { // Rest timer finished
                        // Check if this interval is still the globally active one
                        if (activeIntervalIdRef.current === newIntervalId) {
                            clearInterval(newIntervalId!); // Stop this interval
                            activeIntervalIdRef.current = null;  // Mark no active interval (THE GATE)

                            const isNotLastTaskInPlan = currentTaskIndex < plan.tasks.length - 1;
                            if (isNotLastTaskInPlan) {
                                setTimeout(handleNext, 0);
                            }
                            return isNotLastTaskInPlan ? null : 0;
                        } else {
                            // This is a stale tick from an interval that is no longer active.
                            clearInterval(newIntervalId!); // Ensure this specific stale interval is stopped.
                            return prev; // Or null, to avoid changing state if already handled
                        }
                    }
                    return prev - 1;
                });
            }, 1000);
        } else if (currentTask.type === 'task' && currentTask.fields) {
            const timerField = currentTask.fields.find(f => f.type === 'timer_down' || f.type === 'timer_up');
            if (timerField) {
                if (timeRemaining === null) {
                    const taskName = currentTask.name;
                    let count = 0;
                    for (let i = 0; i <= currentTaskIndex; i++) {
                        const iterTask = plan.tasks[i];
                        if (iterTask.type === 'task' && iterTask.name === taskName) {
                            count++;
                        }
                    }
                    const storageKey = `${taskName}-${count}-${timerField.name}`;
                    const initialValue = fieldValues[storageKey] ?? timerField.defaultValue;
                    setTimeRemaining(initialValue);
                }

                newIntervalId = window.setInterval(() => {
                    setTimeRemaining(prev => {
                        if (prev === null) return null;
                        const newValue = timerField.type === 'timer_down' ? prev - 1 : prev + 1;
                        if (timerField.type === 'timer_down' && newValue < 0) {
                            // Check if this interval is still the globally active one
                            if (activeIntervalIdRef.current === newIntervalId) {
                                clearInterval(newIntervalId!); // Stop this interval
                                activeIntervalIdRef.current = null;  // Mark no active interval
                            } else {
                                // Stale tick for task timer, ensure it's cleared
                                clearInterval(newIntervalId!); // Ensure this specific stale interval is stopped.
                            }
                            return 0;
                        }
                        return newValue;
                    });
                }, 1000);
            }
        }

        // 2. If a new interval was set in this run, mark it as active.
        if (newIntervalId !== undefined) {
            activeIntervalIdRef.current = newIntervalId;
        }

        // 3. useEffect cleanup function
        return () => {
            if (newIntervalId !== undefined) { // If this run actually created an interval
                clearInterval(newIntervalId);
                // If the interval being cleared was the one marked as globally active, nullify the ref.
                if (activeIntervalIdRef.current === newIntervalId) {
                    activeIntervalIdRef.current = null;
                }
            }
        };
    }, [isExecuting, plan, currentTaskIndex, isPaused, fieldValues, timeRemaining, handleNext]);

    if (!plan) return <div>Plan not found</div>;

    const updateFieldValue = (taskName: string, taskCount: number, field: Field, delta: number) => {
        const storageKey = `${taskName}-${taskCount}-${field.name}`;
        const currentValue = fieldValues[storageKey] ?? field.defaultValue;
        const newValue = Math.min(Math.max(currentValue + delta, field.minValue), field.maxValue);
        setFieldValues(prev => ({ ...prev, [storageKey]: newValue }));
    };

    const formatFieldValue = (field: Field, value: number) => {
        let minutes: number, seconds: number;
        switch (field.type) {
            case 'weight': return `${value.toFixed(1)} kg`;
            case 'distance': return `${(value / 1000).toFixed(2)} km`;
            case 'timer_down': case 'timer_up':
                minutes = Math.floor(value / 60);
                seconds = value % 60;
                return `${minutes}:${seconds.toString().padStart(2, '0')}`;
            default: return value.toString();
        }
    };

    const formatTime = (seconds: number) => {
        const minutes = Math.floor(Math.abs(seconds) / 60);
        const remainingSeconds = Math.abs(seconds) % 60;
        const sign = seconds < 0 ? '-' : '';
        return `${sign}${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
    };

    const formatDuration = (totalSeconds: number): string => {
        if (totalSeconds <= 0) return "-"; // Return a dash if no time or invalid
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;
        const parts: string[] = [];
        if (minutes > 0) {
            parts.push(`${minutes}m`);
        }
        if (seconds > 0 || minutes === 0) { // Show seconds if it's the only unit or if minutes are also present
            parts.push(`${seconds}s`);
        }
        return parts.join(' ') || "0s"; // Fallback to 0s if parts is empty (e.g. totalSeconds was 0 and became "-")
    };

    const renderTask = (taskItem: Task | Rest, index: number) => {
        const isCurrentlyExecutingTask = isExecuting && index === currentTaskIndex;
        const isUserActiveTask = !isExecuting && activeTaskIndex === index;
        const isExpanded = isCurrentlyExecutingTask || isUserActiveTask;

        const isPast = isExecuting && index < currentTaskIndex;
        const isFuture = isExecuting && index > currentTaskIndex;

        const handleCardClick = () => {
            if (!isExecuting) {
                setActiveTaskIndex(prevIndex => prevIndex === index ? null : index);
            }
        };

        if (taskItem.type === 'rest') {
            return (
                <div
                    key={`rest-${index}`}
                    className={`task-card rest ${isCurrentlyExecutingTask ? 'active' : ''} ${isPast ? 'past' : ''} ${isFuture ? 'future' : ''}`}
                    onClick={handleCardClick}
                >
                    <div className="task-header">
                        <h3>Rest</h3>
                        {((isExpanded && !isCurrentlyExecutingTask) || (!isExpanded && !isCurrentlyExecutingTask)) && (
                            <span>{taskItem.durationSec}s</span>
                        )}
                        {isCurrentlyExecutingTask && timeRemaining !== null && (
                            <div className="timer">{formatTime(timeRemaining)}</div>
                        )}
                    </div>
                    {isExpanded && isCurrentlyExecutingTask && (
                        <div className="task-controls">
                            <button onClick={(e) => { e.stopPropagation(); setIsPaused(!isPaused); }} className="button button-secondary">
                                {isPaused ? 'Resume' : 'Pause'}
                            </button>
                            <button onClick={(e) => { e.stopPropagation(); handleNext(); }} className="button button-primary" disabled={currentTaskIndex === plan.tasks.length - 1}>
                                Skip
                            </button>
                        </div>
                    )}
                    {isExpanded && !isCurrentlyExecutingTask && (
                        <div className="task-summary">
                            <p>Duration: {taskItem.durationSec} seconds</p>
                        </div>
                    )}
                </div>
            );
        }

        // Regular Task (taskItem is type Task)
        const task = taskItem as Task;

        // --- Logic to calculate numbered display name ---
        const taskNameForDisplay = task.name;
        const currentTaskOriginalIndex = index;
        let displayName = taskNameForDisplay;

        let blockStartIndex = 0;
        for (let i = currentTaskOriginalIndex - 1; i >= 0; i--) {
            const prevTaskItem = plan.tasks[i];
            if (prevTaskItem.type === 'task' && prevTaskItem.name !== taskNameForDisplay) {
                blockStartIndex = i + 1;
                break;
            }
        }

        let blockEndIndex = plan.tasks.length - 1;
        for (let i = currentTaskOriginalIndex + 1; i < plan.tasks.length; i++) {
            const nextTaskItem = plan.tasks[i];
            if (nextTaskItem.type === 'task' && nextTaskItem.name !== taskNameForDisplay) {
                blockEndIndex = i - 1;
                break;
            }
        }

        let tasksInBlockWithNameCount = 0;
        for (let i = blockStartIndex; i <= blockEndIndex; i++) {
            const itemInBlock = plan.tasks[i];
            if (itemInBlock.type === 'task' && itemInBlock.name === taskNameForDisplay) {
                tasksInBlockWithNameCount++;
            }
        }

        if (tasksInBlockWithNameCount > 1) {
            let occurrenceNumber = 0;
            for (let i = blockStartIndex; i <= currentTaskOriginalIndex; i++) {
                const itemUpToCurrent = plan.tasks[i];
                if (itemUpToCurrent.type === 'task' && itemUpToCurrent.name === taskNameForDisplay) {
                    occurrenceNumber++;
                }
            }
            displayName = `${taskNameForDisplay} ${occurrenceNumber}`;
        }
        // --- End of display name logic ---

        // Original taskCount logic for storageKeys (uses task.name and index directly)
        let taskCount = 0;
        for (let i = 0; i <= index; i++) {
            const iterTask = plan.tasks[i];
            if (iterTask.type === 'task' && iterTask.name === task.name) {
                taskCount++;
            }
        }

        return (
            <div
                key={`${task.name}-${index}`}
                className={`task-card ${task.type || 'work'} ${isCurrentlyExecutingTask ? 'active' : ''} ${isPast ? 'past' : ''} ${isFuture ? 'future' : ''} ${isUserActiveTask ? 'user-active' : ''}`}
                onClick={handleCardClick}
            >
                <div className="task-header">
                    <h3>{displayName}</h3>
                    {/* Live timer display */}
                    {isCurrentlyExecutingTask && timeRemaining !== null && task.fields?.find(f => f.type.includes('timer')) ? (
                        <div className="timer">{formatTime(timeRemaining)}</div>
                    ) : task.estimatedTimeSec > 0 && (
                        <span className="estimated-time-header">Est: {formatDuration(task.estimatedTimeSec)}</span>
                    )}
                </div>

                {isExpanded ? (
                    <>
                        {task.estimatedTimeSec > 0 && (
                            <div className="field" key="estimated-time-details">
                                <label>Estimated Time</label>
                                <span className="field-value static">{formatDuration(task.estimatedTimeSec)}</span>
                            </div>
                        )}
                        {task.fields?.map((field) => {
                            const storageKey = `${task.name}-${taskCount}-${field.name}`;
                            const value = fieldValues[storageKey] ?? field.defaultValue;
                            return (
                                <div className="field" key={field.name}>
                                    <label>{field.name}</label>
                                    {field.type === 'timer_down' || field.type === 'timer_up' ? (
                                        <span className="field-value timer-field">{formatFieldValue(field, value)}</span>
                                    ) : (
                                        <div className="field-controls">
                                            <button
                                                onClick={(e) => { e.stopPropagation(); updateFieldValue(task.name, taskCount, field, -1); }}
                                                disabled={isExecuting || value <= field.minValue}
                                                className="button button-secondary"
                                            >
                                                -
                                            </button>
                                            <span className="field-value">{formatFieldValue(field, value)}</span>
                                            <button
                                                onClick={(e) => { e.stopPropagation(); updateFieldValue(task.name, taskCount, field, 1); }}
                                                disabled={isExecuting || value >= field.maxValue}
                                                className="button button-secondary"
                                            >
                                                +
                                            </button>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                        {isCurrentlyExecutingTask && (() => {
                            const timerDownField = task.fields?.find(f => f.type === 'timer_down');
                            const hasTimerUpField = task.fields?.some(f => f.type === 'timer_up');

                            if (timerDownField && (timeRemaining === 0 || stoppedTimerTaskIndex === index)) {
                                return (
                                    <div className="task-controls">
                                        <button onClick={(e) => { e.stopPropagation(); handleNext(); }} className="button button-primary" disabled={currentTaskIndex === plan.tasks.length - 1}>
                                            Continue
                                        </button>
                                    </div>
                                );
                            } else if (timerDownField || hasTimerUpField) {
                                return (
                                    <div className="task-controls">
                                        <button onClick={(e) => { e.stopPropagation(); setIsPaused(!isPaused); }} className="button button-secondary">
                                            {isPaused ? 'Resume' : 'Pause'}
                                        </button>
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                if (timerDownField) {
                                                    setIsPaused(true);
                                                    setStoppedTimerTaskIndex(index);
                                                } else { // Must be timer_up here
                                                    handleNext();
                                                }
                                            }}
                                            className="button button-primary"
                                            disabled={hasTimerUpField && !timerDownField && (currentTaskIndex === plan.tasks.length - 1)}
                                        >
                                            Stop
                                        </button>
                                    </div>
                                );
                            } else {
                                return (
                                    <div className="task-controls">
                                        <button onClick={(e) => { e.stopPropagation(); handleNext(); }} className="button button-primary" disabled={currentTaskIndex === plan.tasks.length - 1}>
                                            Continue
                                        </button>
                                    </div>
                                );
                            }
                        })()}
                    </>
                ) : (
                    <div className="task-summary">
                        {task.fields?.slice(0, 2).map(field => {
                            const storageKey = `${task.name}-${taskCount}-${field.name}`;
                            const value = fieldValues[storageKey] ?? field.defaultValue;
                            return (
                                <div key={field.name} className="summary-field">
                                    <span className="summary-field-name">{field.name}:</span>
                                    <span className="summary-field-value">{formatFieldValue(field, value)}</span>
                                </div>
                            );
                        })}
                        {(!task.fields || task.fields.length === 0) && <p>No configurable fields.</p>}
                        {(task.fields && task.fields.length > 2) && <p>...</p>}
                    </div>
                )}
            </div>
        );
    };

    const startExecution = () => {
        if (!plan) return;
        let totalDuration = 0;
        plan.tasks.forEach(item => {
            if (item.type === 'task') {
                totalDuration += item.estimatedTimeSec || 0;
            } else { // rest
                totalDuration += item.durationSec || 0;
            }
        });
        setInitialPlanDuration(totalDuration);
        setCurrentPlanTimeRemaining(totalDuration);

        setActiveTaskIndex(null);
        setCurrentTaskIndex(0);
        setTimeRemaining(null);
        setIsPaused(false);
        setStoppedTimerTaskIndex(null);
        setIsExecuting(true);
    };

    const stopExecution = () => {
        setIsExecuting(false);
        setCurrentTaskIndex(0);
        setTimeRemaining(null);
        setIsPaused(false);
        setStoppedTimerTaskIndex(null);
        setInitialPlanDuration(null); // Reset on stop
        setCurrentPlanTimeRemaining(null); // Reset on stop
    };

    return (
        <div className="plan-view">
            <Link to="/" className="back-link">← Back to Plans</Link>

            <div className="sticky-plan-header">
                <h2>{plan.name}</h2>
                {isExecuting && initialPlanDuration !== null && currentPlanTimeRemaining !== null ? (
                    <div className="plan-progress-details">
                        <div className="plan-time-remaining">
                            Time Remaining: {formatDuration(currentPlanTimeRemaining)}
                        </div>
                        <div className="plan-percent-complete">
                            Progress: {initialPlanDuration > 0 ?
                                (((initialPlanDuration - currentPlanTimeRemaining) / initialPlanDuration) * 100).toFixed(0)
                                : 0}%
                        </div>
                        <div className="execution-controls">
                            <button onClick={stopExecution} className="button button-secondary stop-button">
                                Stop Plan
                            </button>
                        </div>
                    </div>
                ) : (
                    <button onClick={startExecution} className="button button-primary execute-button">
                        Start Plan
                    </button>
                )}
            </div>

            <div className="task-list">
                {plan.tasks.map((task, index) => renderTask(task, index))}
            </div>
        </div>
    );
};

export default PlanView; 
