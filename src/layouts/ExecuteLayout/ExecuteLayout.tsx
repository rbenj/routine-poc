import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { usePlan, usePlanFields } from '@/features/plan';
import { TaskExecute, TaskQueue } from '@/features/task';
import { RestExecute, RestQueue } from '@/features/rest';
import type { Field } from '@/models';
import { formatFuzzyDuration } from '@/utils';
import styles from './ExecuteLayout.module.css';

export function ExecuteLayout() {
  const [itemIndex, setItemIndex] = useState(0);

  const { planName } = useParams();
  const plan = usePlan(planName);

  const { getTaskFields, setTaskFieldValue } = usePlanFields(plan);

  if (!plan) {
    return <div>404</div>;
  }

  const estimatedSeconds = plan.getEstimatedSeconds();
  const remainingEstimatedSeconds = plan.getRemainingSeconds(itemIndex);

  const item = plan.items[itemIndex];

  const queueItems = plan.getItems(itemIndex + 1, 2);

  const handleNextItem = () => {
    if (itemIndex + 1 < plan.items.length) {
      setItemIndex(prev => prev + 1);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <Link to={`/plan/${encodeURIComponent(plan.name)}`} className={styles.back}>
          ←
        </Link>

        <h2 className={styles.title}>
          {plan.name}
        </h2>

        <div className={styles.timeRemaining}>
          {`About ${formatFuzzyDuration(remainingEstimatedSeconds)} left`}
        </div>

        <div className={styles.progressBarContainer}>
          <div
            className={styles.progressBar}
            style={{ width: `${(estimatedSeconds - remainingEstimatedSeconds) / estimatedSeconds * 100}%` }}
          ></div>
        </div>

        <div className={styles.activeItem}>
          {item.type === 'task' ? (
            <TaskExecute
              estimatedSeconds={item.estimatedSeconds}
              fields={getTaskFields(item.key)}
              name={item.name}
              onChangeFieldValue={(field: Field, value: number) => {
                setTaskFieldValue(item.key, field.key, value);
              }}
              onClickContinue={handleNextItem}
              setNumber={item.set || 0}
              timerDurationSeconds={item.getTimerDurationSeconds()}
            />
          ) : (
            <RestExecute
              onClickContinue={handleNextItem}
              durationSeconds={item.durationSeconds}
            />
          )}
        </div>

        {queueItems.length > 0 && (
          <div className={styles.queue}>
            <div className={styles.queueTitle}>
              Next Up
            </div>

            <div className={styles.queueItems}>
              {queueItems.map((item, index) => {
                return (
                  <div key={index} className={styles.queueItem}>
                    {item.type === 'task' ? (
                      <TaskQueue
                        fields={getTaskFields(item.key)}
                        name={item.name}
                        setNumber={item.set || 0}
                      />
                    ) : (
                      <RestQueue
                        durationSeconds={item.durationSeconds}
                      />
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
