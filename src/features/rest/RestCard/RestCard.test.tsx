import { describe, it, expect } from 'vitest';
import { render, screen } from '@/tests';
import { RestCard } from './RestCard';

describe('RestCard', () => {
  it('renders with required props', () => {
    render(
      <RestCard
        durationSeconds={60}
      />,
    );

    expect(screen.getByText('Rest for 1 minute')).toBeInTheDocument();
  });

  it('applies custom className', () => {
    const { container } = render(
      <RestCard
        className="custom-class"
        durationSeconds={60}
      />,
    );

    expect(container.firstChild).toHaveClass('custom-class');
  });

  it('formats duration correctly', () => {
    const { rerender } = render(
      <RestCard
        durationSeconds={3600}
      />,
    );
    expect(screen.getByText('Rest for 1 hour')).toBeInTheDocument();

    rerender(
      <RestCard
        durationSeconds={90}
      />,
    );
    expect(screen.getByText('Rest for 2 minutes')).toBeInTheDocument();
  });
});
