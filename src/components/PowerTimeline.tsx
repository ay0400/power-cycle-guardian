
import React from 'react';
import { getNextThreeEvents, formatTime, formatDateTime } from '@/utils/powerCycleUtils';

interface PowerTimelineProps {
  startDate: Date;
}

const PowerTimeline: React.FC<PowerTimelineProps> = ({ startDate }) => {
  const events = getNextThreeEvents(startDate);
  
  return (
    <div className="mt-8 bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-2xl font-bold mb-4">Upcoming Power Events</h2>
      <div className="space-y-6">
        {events.map((event, index) => (
          <div key={index} className="relative pl-8">
            {/* Line connecting events */}
            {index < events.length - 1 && (
              <div className="absolute left-4 top-6 h-full w-0.5 -ml-px bg-gray-200 z-0"></div>
            )}
            
            {/* Event dot */}
            <div className={`absolute left-0 top-1 w-8 h-8 rounded-full flex items-center justify-center z-10 ${
              event.type === "on" 
                ? "bg-blue-100 text-blue-600 border-2 border-blue-500" 
                : "bg-gray-100 text-gray-600 border-2 border-gray-500"
            }`}>
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="h-4 w-4" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              >
                {event.type === "on" 
                  ? <path d="M5 12h14" /> 
                  : <path d="M18 6L6 18M6 6l12 12" />}
              </svg>
            </div>
            
            {/* Event content */}
            <div className="pb-6">
              <div className={`font-bold text-lg ${
                event.type === "on" ? "text-blue-600" : "text-gray-600"
              }`}>
                Power going {event.type.toUpperCase()}
              </div>
              <time className="text-gray-500">{formatDateTime(event.date)}</time>
              <p className="mt-1 text-gray-600">
                {event.type === "on" 
                  ? "Power will become available for 48 hours" 
                  : "Power will be unavailable for 24 hours"}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PowerTimeline;
