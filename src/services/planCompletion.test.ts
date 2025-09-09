import { describe, it, expect, beforeEach } from 'vitest';
import { getPlanCompletionDate, setPlanCompletionDate } from './planCompletion';

describe('planCompletion', () => {
    beforeEach(() => {
        // Clear localStorage before each test
        localStorage.clear();
    });

    describe('setPlanCompletionDate', () => {
        it('stores completion date for a plan', () => {
            const planSlug = 'test-plan';
            const testDate = new Date('2024-01-15T10:30:00Z');

            setPlanCompletionDate(planSlug, testDate);

            const stored = getPlanCompletionDate(planSlug);
            expect(stored).toEqual(testDate);
        });

        it('uses current date when no date provided', () => {
            const planSlug = 'test-plan';
            const before = new Date();

            setPlanCompletionDate(planSlug);

            const after = new Date();
            const stored = getPlanCompletionDate(planSlug);

            expect(stored).toBeInstanceOf(Date);
            expect(stored!.getTime()).toBeGreaterThanOrEqual(before.getTime());
            expect(stored!.getTime()).toBeLessThanOrEqual(after.getTime());
        });

        it('overwrites existing completion date', () => {
            const planSlug = 'test-plan';
            const firstDate = new Date('2024-01-15T10:30:00Z');
            const secondDate = new Date('2024-01-20T14:45:00Z');

            setPlanCompletionDate(planSlug, firstDate);
            setPlanCompletionDate(planSlug, secondDate);

            const stored = getPlanCompletionDate(planSlug);
            expect(stored).toEqual(secondDate);
        });
    });

    describe('getPlanCompletionDate', () => {
        it('returns null for non-existent plan', () => {
            const result = getPlanCompletionDate('non-existent-plan');
            expect(result).toBeNull();
        });

        it('returns null for invalid stored date', () => {
            const planSlug = 'test-plan';
            localStorage.setItem(`plan_completion_${planSlug}`, JSON.stringify('invalid-date'));

            const result = getPlanCompletionDate(planSlug);
            expect(result).toBeNull();
        });

        it('returns null for empty stored value', () => {
            const planSlug = 'test-plan';
            localStorage.setItem(`plan_completion_${planSlug}`, JSON.stringify(''));

            const result = getPlanCompletionDate(planSlug);
            expect(result).toBeNull();
        });

        it('returns correct date for valid stored value', () => {
            const planSlug = 'test-plan';
            const testDate = new Date('2024-03-15T09:30:00Z');
            // robustStorage stores values as JSON, so we need to store it properly
            localStorage.setItem(`plan_completion_${planSlug}`, JSON.stringify(testDate.toISOString()));

            const result = getPlanCompletionDate(planSlug);
            expect(result).toEqual(testDate);
        });
    });
});
