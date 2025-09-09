import classNames from 'classnames';
import { PlanCard, usePlansByDay } from '@/features/plan';
import { getPlanCompletionDate } from '@/services/planCompletion';
import { cardStyles } from '@/styles';
import { DayOfWeek } from '@/types';
import styles from './DashboardLayout.module.css';

export function DashboardLayout() {
  const plansByDay = usePlansByDay();

  const totalPlans = Array.from(plansByDay.values()).reduce((sum, plans) => sum + plans.length, 0);

  return (
    <div className={styles.dashboardLayout}>
      <h1 className={styles.title}>
        Welcome Back
      </h1>

      <div className={styles.description}>
        {`You have ${totalPlans} plan${totalPlans === 1 ? '' : 's'} assigned`}
      </div>

      {Array.from(plansByDay.entries()).map(([day, plans]) => (
        <section key={day} className={styles.day}>
          <div className={classNames(styles.dayTitle, cardStyles.smallCard)}>
            {DayOfWeek[day]}
          </div>

          <div className={styles.plans}>
            {plans.map(plan => (
              <PlanCard
                className={styles.plan}
                estimatedSeconds={plan.getEstimatedSeconds()}
                key={plan.name}
                lastCompletedDate={getPlanCompletionDate(plan.slug)}
                name={plan.name}
                to={`/plan/${plan.slug}`}
              />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
