import { useState, useEffect, useRef } from 'react';

const CountdownTimer = ({
  initialTime = 300,
  onComplete,
  resetKey,
  isRunning = true,
  onTimeUpdate
}) => {
  const [timeLeft, setTimeLeft] = useState(initialTime);

  const onCompleteRef = useRef(onComplete);
  const onTimeUpdateRef = useRef(onTimeUpdate);
  const hasCompletedRef = useRef(false);

  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  useEffect(() => {
    onTimeUpdateRef.current = onTimeUpdate;
  }, [onTimeUpdate]);

  useEffect(() => {
    setTimeLeft(initialTime);
    hasCompletedRef.current = false;
    onTimeUpdateRef.current?.(initialTime);
  }, [initialTime, resetKey]);

  useEffect(() => {
    if (!isRunning || timeLeft <= 0) return;

    const timerId = setTimeout(() => {
      setTimeLeft((prev) => Math.max(prev - 1, 0));
    }, 1000);

    return () => clearTimeout(timerId);
  }, [isRunning, timeLeft]);

  useEffect(() => {
    onTimeUpdateRef.current?.(timeLeft);

    if (timeLeft === 0 && !hasCompletedRef.current) {
      hasCompletedRef.current = true;
      onCompleteRef.current?.();
    }
  }, [timeLeft]);

  const formatTime = (seconds) => {
    const safeSeconds = Math.max(0, seconds);
    const mins = Math.floor(safeSeconds / 60);
    const secs = safeSeconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const progressPercent = initialTime > 0 ? (timeLeft / initialTime) * 100 : 0;
  const isWarning = timeLeft <= 60 && timeLeft > 0;
  const isExpired = timeLeft === 0;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 w-full">
      <div className="relative w-40 h-40 mx-auto mb-4">
        <svg className="w-full h-full transform -rotate-90">
          <circle
            cx="80"
            cy="80"
            r="72"
            stroke="currentColor"
            strokeWidth="8"
            fill="none"
            className="text-gray-200 dark:text-gray-700"
          />
          <circle
            cx="80"
            cy="80"
            r="72"
            stroke="currentColor"
            strokeWidth="8"
            fill="none"
            strokeDasharray={2 * Math.PI * 72}
            strokeDashoffset={2 * Math.PI * 72 * (1 - progressPercent / 100)}
            className={`transition-all duration-300 ease-linear ${
              isExpired
                ? 'text-red-500'
                : isWarning
                ? 'text-orange-500'
                : 'text-primary-500'
            }`}
            strokeLinecap="round"
          />
        </svg>

        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span
            className={`text-3xl font-bold font-mono ${
              isExpired
                ? 'text-red-500'
                : isWarning
                ? 'text-orange-500'
                : 'text-gray-900 dark:text-white'
            }`}
          >
            {formatTime(timeLeft)}
          </span>

          {isWarning && !isExpired && (
            <span className="text-xs text-orange-500 mt-1">Time running out!</span>
          )}

          {isExpired && (
            <span className="text-xs text-red-500 mt-1">Time&apos;s up!</span>
          )}
        </div>
      </div>

      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
        <div
          className={`h-full transition-all duration-300 ${
            isExpired
              ? 'bg-red-500'
              : isWarning
              ? 'bg-orange-500'
              : 'bg-primary-500'
          }`}
          style={{ width: `${Math.max(0, progressPercent)}%` }}
        />
      </div>

      <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-3">
        {Math.floor(Math.max(0, progressPercent))}% remaining
      </p>
    </div>
  );
};

export default CountdownTimer;