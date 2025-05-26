import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@/tests';
import { FieldEdit } from './FieldEdit';
import type { Field } from '@/models';

describe('FieldEdit', () => {
  const mockField: Field = {
    initialValueSource: 'memory' as const,
    maxValue: 100,
    minValue: 0,
    value: 50,
    defaultValue: 50,
    key: 'weight',
    name: 'weight',
    type: 'weight' as const,
  };

  it('renders with required props', () => {
    render(
      <FieldEdit
        field={mockField}
        onChangeValue={vi.fn()}
      />,
    );

    // The edit button should be present
    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  it('applies custom className', () => {
    const { container } = render(
      <FieldEdit
        className="custom-class"
        field={mockField}
        onChangeValue={vi.fn()}
      />,
    );

    expect(container.firstChild).toHaveClass('custom-class');
  });

  it('does not render when field.initialValueSource is not memory', () => {
    const nonMemoryField: Field = {
      ...mockField,
      initialValueSource: 'default' as const,
    };

    const { container } = render(
      <FieldEdit
        field={nonMemoryField}
        onChangeValue={vi.fn()}
      />,
    );

    expect(container.firstChild).toBeNull();
  });

  it('shows overlay when edit button is clicked', () => {
    render(
      <FieldEdit
        field={mockField}
        onChangeValue={vi.fn()}
      />,
    );

    // Click the edit button
    const editButton = screen.getByRole('button');
    fireEvent.click(editButton);

    // The overlay should be visible with the AdjustNumber component
    expect(screen.getByRole('textbox')).toBeInTheDocument();
    expect(screen.getByText('lbs')).toBeInTheDocument();
  });

  it('calls onChangeValue when value is changed', () => {
    const onChangeValue = vi.fn();
    render(
      <FieldEdit
        field={mockField}
        onChangeValue={onChangeValue}
      />,
    );

    // Click the edit button
    const editButton = screen.getByRole('button');
    fireEvent.click(editButton);

    // Click the increment button
    const incrementButton = screen.getAllByRole('button')[1];
    fireEvent.click(incrementButton);

    // Click the close button
    const closeButton = screen.getAllByRole('button')[3];
    fireEvent.click(closeButton);

    expect(onChangeValue).toHaveBeenCalledWith(mockField, 51);
  });
});
