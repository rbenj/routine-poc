import { useState } from 'react';
import { AdjustNumber, IconButton, Overlay } from '@/components';
import { EditIcon } from '@/icons';
import type { Field } from '@/models';

interface FieldEditProps {
  className?: string;
  field: Field;
  onChangeValue: (field: Field, value: number) => void;
}

export function FieldEdit({
  className,
  field,
  onChangeValue,
}: FieldEditProps) {
  const [isEditing, setIsEditing] = useState(false);

  if (field.initialValueSource !== 'memory') {
    return null;
  }

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleClose = () => {
    setIsEditing(false);
  };

  const handleChange = (value: number) => {
    onChangeValue(field, value);
  };

  return (
    <>
      <IconButton
        className={className}
        icon={<EditIcon />}
        onClick={handleEdit}
      />

      {isEditing && (
        <Overlay onClose={handleClose}>
          <AdjustNumber
            max={field.maxValue}
            min={field.minValue}
            onChange={handleChange}
            unitLabel="lbs"
            value={field.value}
          />
        </Overlay>
      )}
    </>
  );
}
