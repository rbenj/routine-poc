import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@/tests';
import { NumberSlider } from './NumberSlider';

describe('NumberSlider', () => {
  const mockLabels = {
    1: 'Easy',
    2: 'Medium',
    3: 'Hard',
  };

  it('renders with required props', () => {
    render(
      <NumberSlider
        fieldName="test-field"
        formattedValue="2"
        onChange={vi.fn()}
        value={2}
        min={1}
        max={3}
      />,
    );

    expect(screen.getByText('2')).toBeInTheDocument();
    expect(screen.getByRole('slider')).toHaveAttribute('min', '1');
    expect(screen.getByRole('slider')).toHaveAttribute('max', '3');
  });

  it('applies custom className', () => {
    const { container } = render(
      <NumberSlider
        className="custom-class"
        fieldName="test-field"
        formattedValue="2"
        onChange={vi.fn()}
        value={2}
        min={1}
        max={3}
      />,
    );

    expect(container.firstChild).toHaveClass('custom-class');
  });

  it('calls onChange when slider value changes', () => {
    const onChange = vi.fn();
    render(
      <NumberSlider
        fieldName="test-field"
        formattedValue="2"
        onChange={onChange}
        value={2}
        min={1}
        max={3}
      />,
    );

    const slider = screen.getByRole('slider');
    fireEvent.change(slider, { target: { value: '3' } });

    expect(onChange).toHaveBeenCalledWith(3);
  });

  it('displays label when labelMap is provided', () => {
    render(
      <NumberSlider
        fieldName="test-field"
        formattedValue="2"
        onChange={vi.fn()}
        value={2}
        min={1}
        max={3}
        labelMap={mockLabels}
      />,
    );

    expect(screen.getByText('Medium')).toBeInTheDocument();
  });

  it('does not display label when value is not in labelMap', () => {
    render(
      <NumberSlider
        fieldName="test-field"
        formattedValue="4"
        onChange={vi.fn()}
        value={4}
        min={1}
        max={5}
        labelMap={mockLabels}
      />,
    );

    expect(screen.queryByText('Easy')).not.toBeInTheDocument();
    expect(screen.queryByText('Medium')).not.toBeInTheDocument();
    expect(screen.queryByText('Hard')).not.toBeInTheDocument();
  });

  it('uses custom step value', () => {
    render(
      <NumberSlider
        fieldName="test-field"
        formattedValue="2"
        onChange={vi.fn()}
        value={2}
        min={1}
        max={5}
        step={0.5}
      />,
    );

    expect(screen.getByRole('slider')).toHaveAttribute('step', '0.5');
  });
});
