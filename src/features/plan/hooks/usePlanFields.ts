import { useState, useEffect, useCallback } from 'react';
import type { Plan, Field } from '@/models';
import { robustStorage } from '@/utils';

type FieldsByTask = Record<string, Field[]>;
type EndFieldsByTask = Record<string, Field[]>;

function getStorageKey(taskKey: string, fieldKey: string) {
  return `field-value-v1-${taskKey}-${fieldKey}`;
}

function getEndFieldStorageKey(taskKey: string, fieldKey: string) {
  return `field-value-v1-${taskKey}-end-${fieldKey}`;
}

export function usePlanFields(plan: Plan | undefined) {
  const [fieldsByTask, setFieldsByTask] = useState<FieldsByTask>({});
  const [endFieldsByTask, setEndFieldsByTask] = useState<EndFieldsByTask>({});

  // copy fields from plan data, and lace in stored values whenever plan changes
  useEffect(() => {
    if (!plan) {
      return;
    }

    const fieldsupdate: FieldsByTask = {};
    const endFieldsUpdate: EndFieldsByTask = {};

    plan.items.forEach((item) => {
      if (item.type !== 'task') {
        return;
      }

      if (item.fields) {
        const fieldsUpdate = item.fields.map(v => ({ ...v }));

        fieldsUpdate.forEach((fieldUpdate) => {
          if (fieldUpdate.initialValueSource === 'memory') {
            const storageKey = getStorageKey(item.key, fieldUpdate.key);
            if (robustStorage.hasItem(storageKey)) {
              fieldUpdate.value = robustStorage.getItem(storageKey, 0);
            }
          }
        });

        fieldsupdate[item.key] = fieldsUpdate;
      }

      if (item.endFields && item.endFields.length > 0) {
        const endFieldsData = item.endFields.map(v => ({ ...v }));

        endFieldsData.forEach((fieldUpdate) => {
          if (fieldUpdate.initialValueSource === 'memory') {
            const storageKey = getEndFieldStorageKey(item.key, fieldUpdate.key);
            if (robustStorage.hasItem(storageKey)) {
              fieldUpdate.value = robustStorage.getItem(storageKey, fieldUpdate.defaultValue);
            }
          }
        });

        endFieldsUpdate[item.key] = endFieldsData;
      }
    });

    setFieldsByTask(fieldsupdate);
    setEndFieldsByTask(endFieldsUpdate);
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

  // save end field value changes to storage
  useEffect(() => {
    if (!plan) {
      return;
    }

    Object.entries(endFieldsByTask).forEach(([taskKey, fields]) => {
      fields.forEach((field) => {
        if (field.initialValueSource === 'memory') {
          const storageKey = getEndFieldStorageKey(taskKey, field.key);
          robustStorage.setItem(storageKey, field.value);
        }
      });
    });
  }, [plan, endFieldsByTask]);

  const getTaskFields = useCallback((taskKey: string) => {
    return fieldsByTask[taskKey] ?? [];
  }, [fieldsByTask]);

  const getTaskEndFields = useCallback((taskKey: string) => {
    return endFieldsByTask[taskKey] ?? [];
  }, [endFieldsByTask]);

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

  const setTaskEndFieldValue = useCallback(
    (taskKey: string, fieldKey: string, value: number) => {
      setEndFieldsByTask((prev) => {
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
    [setEndFieldsByTask],
  );

  return {
    getTaskFields,
    getTaskEndFields,
    setTaskFieldValue,
    setTaskEndFieldValue,
  };
}
