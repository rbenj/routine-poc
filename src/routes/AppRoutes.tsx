import { Routes, Route } from 'react-router-dom';
import { DashboardLayout, PlanLayout, ExecuteLayout } from '@/layouts';

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<DashboardLayout />} />
      <Route path="/plan/:planName" element={<PlanLayout />} />
      <Route path="/plan/:planName/execute" element={<ExecuteLayout />} />
    </Routes>
  );
}
