import { describe, it, expect } from 'vitest';
import { render, screen } from '@/tests';
import { PlanHeader } from './PlanHeader';

describe('PlanHeader', () => {
  it('renders with required props', () => {
    render(
      <PlanHeader
        backTo="/plans"
        name="Test Plan"
        timeText="30 minutes"
      />,
    );

    expect(screen.getByRole('heading', { name: 'Test Plan' })).toBeInTheDocument();
    expect(screen.getByText('30 minutes')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Back' })).toBeInTheDocument();
  });

  it('renders start button when startTo is provided', () => {
    render(
      <PlanHeader
        backTo="/plans"
        name="Test Plan"
        startTo="/start"
        timeText="30 minutes"
      />,
    );

    expect(screen.getByRole('button', { name: 'Start' })).toBeInTheDocument();
  });

  it('does not render start button when startTo is not provided', () => {
    render(
      <PlanHeader
        backTo="/plans"
        name="Test Plan"
        timeText="30 minutes"
      />,
    );

    expect(screen.queryByRole('button', { name: 'Start' })).not.toBeInTheDocument();
  });

  it('applies custom className', () => {
    render(
      <PlanHeader
        backTo="/plans"
        className="custom-class"
        name="Test Plan"
        timeText="30 minutes"
      />,
    );

    expect(screen.getByRole('heading', { name: 'Test Plan' }).parentElement?.parentElement).toHaveClass('custom-class');
  });
});
