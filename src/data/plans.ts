import type { Plan } from '../types';

export const plans: Plan[] = [
    {
        name: 'Pull Day',
        tasks: [
            {
                type: 'task',
                name: 'Warmup',
                estimatedTimeSec: 300,
                fields: [
                    {
                        name: 'Time',
                        type: 'timer_down',
                        initialValueSource: 'default',
                        defaultValue: 300,
                        minValue: 0,
                        maxValue: 900,
                    },
                ],
            },
            {
                type: 'rest',
                durationSec: 60,
            },
            {
                type: 'task',
                name: 'Farmer\'s Carry',
                estimatedTimeSec: 90,
                fields: [
                    {
                        name: 'Weight',
                        type: 'weight',
                        initialValueSource: 'memory',
                        defaultValue: 4.53592,
                        minValue: 0,
                        maxValue: 100,
                    },
                    {
                        name: 'Reps',
                        type: 'int',
                        initialValueSource: 'default',
                        defaultValue: 12,
                        minValue: 1,
                        maxValue: 36,
                    },
                ],
            },
            // ... Additional tasks from spec
        ],
    },
    {
        name: 'Ruck',
        tasks: [
            {
                type: 'task',
                name: 'Ruck',
                estimatedTimeSec: 3600,
                fields: [
                    {
                        name: 'Distance',
                        type: 'distance',
                        initialValueSource: 'memory',
                        defaultValue: 3218.69,
                        minValue: 804.672,
                        maxValue: 32186.9,
                    },
                ],
            },
        ]
    },
]; 
