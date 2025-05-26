import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useTimer } from './useTimer';

describe('useTimer', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  it('initializes with default values', () => {
    const { result } = renderHook(() => useTimer({ totalSeconds: 60 }));

    expect(result.current.timerElapsedSeconds).toBe(0);
    expect(result.current.timerRemainingSeconds).toBe(60);
    expect(result.current.timerIsStarted).toBe(false);
    expect(result.current.timerIsTicking).toBe(false);
    expect(result.current.timerIsExhausted).toBe(false);
  });

  it('starts the timer', () => {
    const { result } = renderHook(() => useTimer({ totalSeconds: 60 }));

    act(() => {
      result.current.startTimer();
    });

    expect(result.current.timerIsStarted).toBe(true);
    expect(result.current.timerIsTicking).toBe(true);
  });

  it('pauses and resumes the timer', () => {
    const { result } = renderHook(() => useTimer({ totalSeconds: 60 }));

    // Start the timer
    act(() => {
      result.current.startTimer();
    });

    // Advance time by 5 seconds
    act(() => {
      vi.advanceTimersByTime(5000);
    });

    // Pause the timer
    act(() => {
      result.current.pauseTimer(true);
    });

    expect(result.current.timerIsTicking).toBe(false);
    expect(result.current.timerElapsedSeconds).toBe(5);

    // Advance time while paused
    act(() => {
      vi.advanceTimersByTime(5000);
    });

    expect(result.current.timerElapsedSeconds).toBe(5);

    // Resume the timer
    act(() => {
      result.current.pauseTimer(false);
    });

    expect(result.current.timerIsTicking).toBe(true);

    // Advance time by 2 more seconds
    act(() => {
      vi.advanceTimersByTime(2000);
    });

    expect(result.current.timerElapsedSeconds).toBe(7);
  });

  it('stops the timer', () => {
    const { result } = renderHook(() => useTimer({ totalSeconds: 60 }));

    // Start the timer
    act(() => {
      result.current.startTimer();
    });

    // Advance time by 5 seconds
    act(() => {
      vi.advanceTimersByTime(5000);
    });

    // Stop the timer
    act(() => {
      result.current.stopTimer();
    });

    expect(result.current.timerIsTicking).toBe(false);
    expect(result.current.timerIsExhausted).toBe(true);
    expect(result.current.timerElapsedSeconds).toBe(5);

    // Advance time after stopping
    act(() => {
      vi.advanceTimersByTime(5000);
    });

    expect(result.current.timerElapsedSeconds).toBe(5);
  });

  it('exhausts when total seconds is reached', () => {
    const { result } = renderHook(() => useTimer({ totalSeconds: 5 }));

    // Start the timer
    act(() => {
      result.current.startTimer();
    });

    // Advance time to reach total seconds
    act(() => {
      vi.advanceTimersByTime(5000);
    });

    expect(result.current.timerIsTicking).toBe(false);
    expect(result.current.timerIsExhausted).toBe(true);
    expect(result.current.timerElapsedSeconds).toBe(5);
    expect(result.current.timerRemainingSeconds).toBe(0);
  });

  it('calculates remaining seconds correctly', () => {
    const { result } = renderHook(() => useTimer({ totalSeconds: 10 }));

    // Start the timer
    act(() => {
      result.current.startTimer();
    });

    // Advance time by 3 seconds
    act(() => {
      vi.advanceTimersByTime(3000);
    });

    expect(result.current.timerElapsedSeconds).toBe(3);
    expect(result.current.timerRemainingSeconds).toBe(7);
  });

  it('cleans up interval on unmount', () => {
    const clearIntervalSpy = vi.spyOn(window, 'clearInterval');
    const { result, unmount } = renderHook(() => useTimer({ totalSeconds: 60 }));

    // Start the timer
    act(() => {
      result.current.startTimer();
    });

    // Unmount the hook
    unmount();

    expect(clearIntervalSpy).toHaveBeenCalled();
  });
});
