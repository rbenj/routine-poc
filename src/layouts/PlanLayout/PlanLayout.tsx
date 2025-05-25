import classNames from 'classnames';
import { useParams } from 'react-router-dom';
import { PlanHeader, usePlan, usePlanFields } from '@/features/plan';
import { TaskCard } from '@/features/task';
import { RestCard } from '@/features/rest';
import type { Field } from '@/models';
import { colorClassName } from '@/services';
import { formatFuzzyDuration } from '@/utils';
import styles from './PlanLayout.module.css';

export function PlanLayout() {
  const { planName } = useParams();
  const plan = usePlan(planName);

  const { getTaskFields, setTaskFieldValue } = usePlanFields(plan);

  if (!plan) {
    return <div>404</div>;
  }

  let lastTaskName = '';
  let colorIndex = -1;

  return (
    <div className={styles.planLayout}>
      <PlanHeader
        backTo="/"
        className={styles.header}
        name={plan.name}
        startTo={`/plan/${encodeURIComponent(plan.name)}/execute`}
        timeText={`About ${formatFuzzyDuration(plan.getEstimatedSeconds())}`}
      />

      <div className={styles.items}>
        {plan.items.map((item, index) => {
          if (item.type === 'task') {
            if (item.name !== lastTaskName) {
              colorIndex++;
            }

            lastTaskName = item.name;

            return (
              <TaskCard
                className={classNames(
                  styles.item,
                  styles.task,
                  styles[`set${item.set || 0}`],
                  colorClassName(colorIndex),
                )}
                estimatedSeconds={item.estimatedSeconds}
                fields={getTaskFields(item.key)}
                key={index}
                name={item.name}
                onChangeFieldValue={(field: Field, value: number) => {
                  setTaskFieldValue(item.key, field.key, value);
                }}
                setNumber={item.set || 0}
              />
            );
          } else if (item.type === 'rest') {
            return (
              <RestCard
                className={classNames(
                  styles.item,
                  styles.rest,
                  colorClassName(colorIndex),
                )}
                durationSeconds={item.durationSeconds}
                key={index}
              />
            );
          }
        })}
      </div>
    </div>
  );
}
