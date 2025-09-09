import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Button } from '@/components';
import { PlanHeader, usePlan, usePlanFields } from '@/features/plan';
import { TaskExecute, TaskQueue } from '@/features/task';
import { RestExecute, RestQueue } from '@/features/rest';
import { CelebrationIcon } from '@/icons';
import type { Field } from '@/models';
import { formatFuzzyDuration } from '@/utils';
import styles from './ExecuteLayout.module.css';

export function ExecuteLayout() {
  const [itemIndex, setItemIndex] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    const metaEl = document.querySelector('meta[name="theme-color"]');

    if (!metaEl) {
      return;
    }

    const originalThemeColor = metaEl.getAttribute('content');
    metaEl.setAttribute('content', '#cea4a5');
    document.body.style.backgroundColor = '#cea4a5';

    return () => {
      if (metaEl && originalThemeColor) {
        metaEl.setAttribute('content', originalThemeColor);
        document.body.style.backgroundColor = originalThemeColor;
      }
    };
  }, []);

  const { planSlug } = useParams();
  const plan = usePlan(planSlug);

  const {
    getTaskFields,
    getTaskEndFields,
    setTaskFieldValue,
    setTaskEndFieldValue,
  } = usePlanFields(plan);

  if (!plan) {
    return <div>404</div>;
  }

  const estimatedSeconds = plan.getEstimatedSeconds();
  const remainingEstimatedSeconds = plan.getRemainingSeconds(itemIndex);

  const progressPercent = isComplete ? 100 : (estimatedSeconds - remainingEstimatedSeconds) / estimatedSeconds * 100;

  const item = plan.items[itemIndex];

  const queueItems = plan.getItems(itemIndex + 1, 2);

  const handleNextItem = () => {
    if (itemIndex + 1 < plan.items.length) {
      setItemIndex(prev => prev + 1);
    } else {
      setIsComplete(true);
    }
  };

  return (
    <div className={styles.executeLayout}>
      <PlanHeader
        backTo={`/plan/${plan.slug}`}
        className={styles.header}
        name={plan.name}
        timeText={`About ${formatFuzzyDuration(remainingEstimatedSeconds)} left`}
      />

      <div className={styles.progressBar}>
        <div
          className={styles.progressBarInner}
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      {isComplete ? (
        <div className={styles.complete}>
          <CelebrationIcon className={styles.completeIcon} />

          <div className={styles.completeTitle}>
            Plan completed!
          </div>

          <Button
            className={styles.completeButton}
            text="Back to dashboard"
            to="/"
          />
        </div>
      ) : (
        <>
          {item.type === 'task' ? (
            <TaskExecute
              key={item.key}
              className={styles.item}
              endFields={getTaskEndFields(item.key)}
              estimatedSeconds={item.estimatedSeconds}
              fields={getTaskFields(item.key)}
              name={item.name}
              onChangeEndFieldValue={(field: Field, value: number) => {
                setTaskEndFieldValue(item.key, field.key, value);
              }}
              onChangeFieldValue={(field: Field, value: number) => {
                setTaskFieldValue(item.key, field.key, value);
              }}
              onClickContinue={handleNextItem}
              setNumber={item.set || 0}
              timerDurationSeconds={item.getTimerDurationSeconds()}
            />
          ) : (
            <RestExecute
              className={styles.item}
              onClickContinue={handleNextItem}
              durationSeconds={item.durationSeconds}
            />
          )}
        </>
      )}

      {queueItems.length > 0 && (
        <div className={styles.queue}>
          <div className={styles.queueTitle}>
            Next up
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
  );
}
