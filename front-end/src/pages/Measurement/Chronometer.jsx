import React, { useState, useEffect, useRef } from "react";
import { ToastContainer, toast } from "react-toastify";

export default function Chronometer() {
  const [isRunning, setIsRunning] = useState(false);
  const [counter, setCounter] = useState(0);
  const previousRafDateRef = useRef(Date.now());
  const rafIdRef = useRef(null);

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text).then(() => {
      toast.success("Time copied to clipboard!");
    });
  };

  // Format milliseconds to HH:MM:SS.mmm
  const formatMs = (msTotal) => {
    const ms = msTotal % 1000;
    const secs = ((msTotal - ms) / 1000) % 60;
    const mins = (((msTotal - ms) / 1000 - secs) / 60) % 60;
    const hrs = (((msTotal - ms) / 1000 - secs) / 60 - mins) / 60;
    const hrsString = hrs > 0 ? `${hrs.toString().padStart(2, '0')}:` : '';

    return `${hrsString}${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}.${ms
      .toString()
      .padStart(3, '0')}`;
  };

  // RequestAnimationFrame loop for precise timing
  const updateTimer = () => {
    const now = Date.now();
    const deltaMs = now - previousRafDateRef.current;
    previousRafDateRef.current = now;
    setCounter((prev) => prev + deltaMs);
    // console.log("Timer Update:", { counter: counter + deltaMs, isRunning });
    rafIdRef.current = requestAnimationFrame(updateTimer);
  };

  // Handle timer start/stop with useEffect
  useEffect(() => {
    if (isRunning) {
      console.log("Starting Timer");
      previousRafDateRef.current = Date.now();
      rafIdRef.current = requestAnimationFrame(updateTimer);
    } else {
      console.log("Stopping Timer");
      if (rafIdRef.current) {
        cancelAnimationFrame(rafIdRef.current);
        rafIdRef.current = null;
      }
    }

    // Cleanup on unmount or isRunning change
    return () => {
      if (rafIdRef.current) {
        cancelAnimationFrame(rafIdRef.current);
        rafIdRef.current = null;
      }
    };
  }, [isRunning]);

  // Start or resume the timer
  const resume = () => {
    if (!isRunning) {
      setIsRunning(true);
    }
  };

  // Pause the timer
  const pause = () => {
    if (isRunning) {
      setIsRunning(false);
    }
  };

  // Reset the timer
  const reset = () => {
    setIsRunning(false);
    setCounter(0);
  };

  const formattedTime = counter >= 0 ? formatMs(counter) : "00:00:00.000";

  return (
    <div className="bg-white shadow-md rounded-xl p-6 space-y-4">
      {/* Timer display */}
      <div className="text-center text-4xl font-mono text-gray-800 my-5">
        <div className="flex justify-center items-center gap-4">
          <span>{formattedTime}</span>
          <button
            onClick={() => handleCopy(formattedTime)}
            className="text-sm text-blue-600 hover:underline flex items-center gap-1"
          >
            <svg viewBox="0 0 24 24" width="1.2em" height="1.2em">
              <path
                fill="currentColor"
                d="M19 21H8V7h11m0-2H8a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h11a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2m-3-4H4a2 2 0 0 0-2 2v14h2V3h12V1Z"
              ></path>
            </svg>
            Copy
          </button>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex justify-center gap-3">
        <button
          onClick={isRunning ? pause : resume}
          className={`px-4 py-2 rounded text-white ${
            isRunning ? "bg-yellow-500 hover:bg-yellow-600" : "bg-blue-500 hover:bg-blue-600"
          }`}
        >
          {isRunning ? "Stop" : "Start"}
        </button>
        <button
          onClick={reset}
          className="px-4 py-2 bg-gray-500 hover:bg-gray-600 rounded text-white"
        >
          Reset
        </button>
      </div>

      <ToastContainer position="bottom-center" autoClose={1000} />
    </div>
  );
}