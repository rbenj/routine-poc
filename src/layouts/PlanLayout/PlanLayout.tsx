import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { usePlan, usePlanFields } from '@/features/plan';
import { TaskCard } from '@/features/task';
import { RestCard } from '@/features/rest';
import type { Field } from '@/models';
import { formatFuzzyDuration } from '@/utils';
import styles from './PlanLayout.module.css';

export function PlanLayout() {
  const [itemIndex, setItemIndex] = useState(-1);

  const { planName } = useParams();
  const plan = usePlan(planName);

  const { getTaskFields, setTaskFieldValue } = usePlanFields(plan);

  if (!plan) {
    return <div>404</div>;
  }

  let lastTaskName = '';
  let groupIndex = 0;

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <Link to="/" className={styles.back}>
          ←
        </Link>

        <h2 className={styles.title}>
          {plan.name}
        </h2>

        <Link key={plan.name} to={`/plan/${encodeURIComponent(plan.name)}/execute`}>
          <button className={styles.startButton}>
            Start
          </button>
        </Link>

        <div className={styles.time}>
          {`About ${formatFuzzyDuration(plan.getEstimatedSeconds())}`}
        </div>
      </div>

      <div className={styles.items}>
        {plan.items.map((item, index) => {
          if (item.type === 'task') {
            if (item.name !== lastTaskName) {
              groupIndex++;
            }

            lastTaskName = item.name;

            return (
              <TaskCard
                estimatedSeconds={item.estimatedSeconds}
                fields={getTaskFields(item.key)}
                groupNumber={groupIndex % 4 + 1}
                isEditing={itemIndex === index}
                key={index}
                name={item.name}
                onChangeFieldValue={(field: Field, value: number) => {
                  setTaskFieldValue(item.key, field.key, value);
                }}
                onClick={() => {
                  if (itemIndex !== index) {
                    setItemIndex(index);
                  }
                }}
                setNumber={item.set || 0}
              />
            );
          } else if (item.type === 'rest') {
            return (
              <RestCard
                key={index}
                durationSeconds={item.durationSeconds}
              />
            );
          }
        })}
      </div>
    </div>
  );
}
