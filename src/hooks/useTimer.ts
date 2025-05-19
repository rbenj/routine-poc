import { useState, useRef, useEffect, useCallback } from 'react';

interface UseTimerOptions {
  totalSeconds: number;
}

export function useTimer({
  totalSeconds = 0,
}: UseTimerOptions) {
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [isStarted, setIsStarted] = useState(false);
  const [isTicking, setIsTicking] = useState(false);
  const [isExhausted, setIsExhausted] = useState(false);

  const intervalRef = useRef<number>(0);
  const startTimeRef = useRef<number>(Date.now());

  const tick = useCallback(() => {
    const now = Date.now();
    const newElapsedSeconds = Math.floor((now - startTimeRef.current) / 1000);
    setElapsedSeconds(newElapsedSeconds);

    if (totalSeconds && newElapsedSeconds >= totalSeconds) {
      setIsTicking(false);
      setIsExhausted(true);
      clearInterval(intervalRef.current);
    }
  }, [totalSeconds]);

  const start = useCallback(() => {
    if (!isStarted) {
      startTimeRef.current = Date.now();
      setIsTicking(true);
      setIsStarted(true);
    }
  }, [isStarted]);

  const pause = useCallback((doPause: boolean) => {
    setIsTicking(!doPause);

    if (doPause) {
      clearInterval(intervalRef.current);
    } else {
      startTimeRef.current = Date.now() - elapsedSeconds * 1000;
    }
  }, [elapsedSeconds]);

  const stop = useCallback(() => {
    clearInterval(intervalRef.current);
    setIsExhausted(true);
    setIsTicking(false);
  }, []);

  useEffect(() => {
    if (!isTicking) {
      return;
    }

    intervalRef.current = window.setInterval(tick, 1000);

    return () => {
      clearInterval(intervalRef.current);
    };
  }, [isTicking, tick]);

  const remainingSeconds = totalSeconds ? Math.max(totalSeconds - elapsedSeconds, 0) : 0;

  return {
    timerElapsedSeconds: elapsedSeconds,
    timerRemainingSeconds: remainingSeconds,
    timerIsStarted: isStarted,
    timerIsTicking: isTicking,
    timerIsExhausted: isExhausted,
    startTimer: start,
    pauseTimer: pause,
    stopTimer: stop,
  };
}
