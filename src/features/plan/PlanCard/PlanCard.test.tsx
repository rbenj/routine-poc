import { describe, it, expect } from 'vitest';
import { render, screen } from '@/tests';
import { PlanCard } from './PlanCard';

describe('PlanCard', () => {
  it('renders with required props', () => {
    render(
      <PlanCard
        estimatedSeconds={1800}
        name="Test Plan"
        to="/plan/1"
      />,
    );

    expect(screen.getByRole('link', { name: /Test Plan/ })).toHaveAttribute('href', '/plan/1');
    expect(screen.getByText('30 min')).toBeInTheDocument();
  });

  it('applies custom className', () => {
    render(
      <PlanCard
        className="custom-class"
        estimatedSeconds={1800}
        name="Test Plan"
        to="/plan/1"
      />,
    );

    expect(screen.getByRole('link', { name: /Test Plan/ }).parentElement?.parentElement).toHaveClass('custom-class');
  });

  it('formats duration correctly', () => {
    const { rerender } = render(
      <PlanCard
        estimatedSeconds={3600}
        name="Test Plan"
        to="/plan/1"
      />,
    );
    expect(screen.getByText('1 hr')).toBeInTheDocument();

    rerender(
      <PlanCard
        estimatedSeconds={90}
        name="Test Plan"
        to="/plan/1"
      />,
    );
    expect(screen.getByText('2 min')).toBeInTheDocument();
  });
});
