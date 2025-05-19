import { Link } from 'react-router-dom';
import { PlanCard, usePlansByDay } from '@/features/plan';
import { DayOfWeek } from '@/types';
import styles from './DashboardLayout.module.css';

export function DashboardLayout() {
  const plansByDay = usePlansByDay();

  return (
    <div className={styles.container}>
      <h1>
        Routine
      </h1>

      {Array.from(plansByDay.entries()).map(([day, plans]) => (
        <section key={day} className={styles.day}>
          <h2 className={styles.dayTitle}>
            {DayOfWeek[day]}
          </h2>

          <div className={styles.plans}>
            {plans.map(plan => (
              <Link key={plan.name} to={`/plan/${encodeURIComponent(plan.name)}`}>
                <PlanCard
                  className={styles.plan}
                  estimatedSeconds={plan.getEstimatedSeconds()}
                  name={plan.name}
                />
              </Link>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
