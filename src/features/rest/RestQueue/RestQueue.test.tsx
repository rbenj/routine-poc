import { describe, it, expect } from 'vitest';
import { render, screen } from '@/tests';
import { RestQueue } from './RestQueue';

describe('RestQueue', () => {
  it('renders with required props', () => {
    render(
      <RestQueue
        durationSeconds={60}
      />,
    );

    expect(screen.getByText('Rest')).toBeInTheDocument();
    expect(screen.getByText('1 min')).toBeInTheDocument();
  });

  it('applies custom className', () => {
    render(
      <RestQueue
        className="custom-class"
        durationSeconds={60}
      />,
    );

    expect(screen.getByText('Rest').parentElement).toHaveClass('custom-class');
  });

  it('formats duration correctly with abbreviations', () => {
    const { rerender } = render(
      <RestQueue
        durationSeconds={3600}
      />,
    );
    expect(screen.getByText('1 hr')).toBeInTheDocument();

    rerender(
      <RestQueue
        durationSeconds={90}
      />,
    );
    expect(screen.getByText('2 min')).toBeInTheDocument();
  });
});
