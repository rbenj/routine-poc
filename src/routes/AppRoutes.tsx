import { Routes, Route } from 'react-router-dom';
import { DashboardLayout, PlanLayout, ExecuteLayout } from '@/layouts';

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<DashboardLayout />} />
      <Route path="/plan/:planSlug" element={<PlanLayout />} />
      <Route path="/plan/:planSlug/execute" element={<ExecuteLayout />} />
    </Routes>
  );
}
