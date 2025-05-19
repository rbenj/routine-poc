import { useState, useEffect, useCallback } from 'react';
import type { Plan, Field } from '@/models';
import { robustStorage } from '@/utils';

type FieldsByTask = Record<string, Field[]>;

function getStorageKey(taskKey: string, fieldKey: string) {
  return `field-value-v1-${taskKey}-${fieldKey}`;
}

export function usePlanFields(plan: Plan | undefined) {
  const [fieldsByTask, setFieldsByTask] = useState<FieldsByTask>({});

  // copy fields from plan data, and lace in stored values whenever plan changes
  useEffect(() => {
    if (!plan) {
      return;
    }

    const update: FieldsByTask = {};

    plan.items.forEach((item) => {
      if (item.type === 'task' && item.fields) {
        const fieldsUpdate = item.fields.map(v => ({ ...v }));

        fieldsUpdate.forEach((fieldUpdate) => {
          if (fieldUpdate.initialValueSource === 'memory') {
            const storageKey = getStorageKey(item.key, fieldUpdate.key);
            if (robustStorage.hasItem(storageKey)) {
              fieldUpdate.value = robustStorage.getItem(storageKey, 0);
            }
          }
        });

        update[item.key] = fieldsUpdate;
      }
    });

    setFieldsByTask(update);
  }, [plan]);

  // save field value changes to storage
  useEffect(() => {
    if (!plan) {
      return;
    }

    Object.entries(fieldsByTask).forEach(([taskKey, fields]) => {
      fields.forEach((field) => {
        if (field.initialValueSource === 'memory') {
          const storageKey = getStorageKey(taskKey, field.key);
          robustStorage.setItem(storageKey, field.value);
        }
      });
    });
  }, [plan, fieldsByTask]);

  const getTaskFields = useCallback((taskKey: string) => {
    return fieldsByTask[taskKey] ?? [];
  }, [fieldsByTask]);

  const setTaskFieldValue = useCallback(
    (taskKey: string, fieldKey: string, value: number) => {
      setFieldsByTask((prev) => {
        const prevFields = prev[taskKey] ?? [];

        const newFields = prevFields.map((v) => {
          return v.key === fieldKey ? { ...v, value } : v;
        });

        return {
          ...prev,
          [taskKey]: newFields,
        };
      });
    },
    [setFieldsByTask],
  );

  return {
    getTaskFields,
    setTaskFieldValue,
  };
} 
