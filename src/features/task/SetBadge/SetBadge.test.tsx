import { describe, it, expect } from 'vitest';
import { render, screen } from '@/tests';
import { SetBadge } from './SetBadge';

describe('SetBadge', () => {
  it('renders with required props', () => {
    render(
      <SetBadge
        number={1}
      />,
    );

    expect(screen.getByText('Set')).toBeInTheDocument();
    expect(screen.getByText('1')).toBeInTheDocument();
  });

  it('applies custom className', () => {
    render(
      <SetBadge
        className="custom-class"
        number={1}
      />,
    );

    expect(screen.getByText('Set').parentElement).toHaveClass('custom-class');
  });

  it('renders nothing when number is 0', () => {
    const { container } = render(
      <SetBadge
        number={0}
      />,
    );

    expect(container).toBeEmptyDOMElement();
  });

  it('renders nothing when number is negative', () => {
    const { container } = render(
      <SetBadge
        number={-1}
      />,
    );

    expect(container).toBeEmptyDOMElement();
  });
});
