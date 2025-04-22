
import React from 'react';
import { calculateCurrentStatus, formatDateTime, getNextEventDate, getNextEventType, getTimeUntilNextEvent, formatTimeRemaining } from '@/utils/powerCycleUtils';

interface PowerStatusProps {
  startDate: Date;
}

const PowerStatus: React.FC<PowerStatusProps> = ({ startDate }) => {
  const [currentTime, setCurrentTime] = React.useState(new Date());
  
  // Update the current time every minute
  React.useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    
    return () => clearInterval(interval);
  }, []);
  
  const currentStatus = calculateCurrentStatus(startDate);
  const nextEventDate = getNextEventDate(startDate);
  const nextEventType = getNextEventType(startDate);
  const timeRemaining = getTimeUntilNextEvent(nextEventDate);
  
  return (
    <div className="rounded-lg overflow-hidden shadow-lg">
      <div 
        className={`p-6 text-white ${
          currentStatus === "on" 
            ? "bg-gradient-to-r from-blue-500 to-cyan-400" 
            : "bg-gradient-to-r from-gray-700 to-gray-900"
        }`}
      >
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-3xl font-bold">Power is {currentStatus.toUpperCase()}</h2>
            <p className="text-lg opacity-90">
              {currentStatus === "on" 
                ? "Your power is currently available" 
                : "Your power is currently unavailable"}
            </p>
          </div>
          <div className={`rounded-full w-16 h-16 flex items-center justify-center ${
            currentStatus === "on" ? "bg-blue-300" : "bg-gray-600"
          }`}>
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-10 w-10" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            >
              <path d="M18 15h-6v4l-7-8 7-8v4h6v8z"/>
            </svg>
          </div>
        </div>
      </div>
      <div className="bg-white p-6">
        <div className="mb-4">
          <h3 className="text-lg font-medium text-gray-700">Next Event</h3>
          <p className="text-xl font-bold">
            Power going {nextEventType.toUpperCase()} at {formatDateTime(nextEventDate)}
          </p>
        </div>
        <div>
          <h3 className="text-lg font-medium text-gray-700">Time Remaining</h3>
          <div className="text-4xl font-bold text-purple-600">
            {formatTimeRemaining(timeRemaining.hours, timeRemaining.minutes)}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PowerStatus;
