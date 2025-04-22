
import { addDays, addHours, format, differenceInHours, differenceInMinutes } from 'date-fns';

// The power cycle is:
// 2 days ON (starting at 12:00 PM)
// 1 day OFF 
// Repeats every 3 days

export function calculateCurrentStatus(startDate: Date): "on" | "off" {
  const now = new Date();
  const cyclePositionInHours = getPositionInCycle(startDate, now);
  
  // The cycle is 72 hours (3 days) total
  // First 48 hours (2 days) are ON
  // Last 24 hours (1 day) are OFF
  return cyclePositionInHours < 48 ? "on" : "off";
}

export function getPositionInCycle(startDate: Date, currentDate: Date = new Date()): number {
  // Total hours since the cycle started
  const totalHours = differenceInHours(currentDate, startDate);
  
  // Position in the current cycle (0-71 hours)
  return totalHours % 72;
}

export function getNextEventDate(startDate: Date): Date {
  const now = new Date();
  const cyclePositionInHours = getPositionInCycle(startDate, now);
  
  // If we're in the ON period, the next event is going OFF (at 48 hours into cycle)
  // If we're in the OFF period, the next event is going ON (at 0 hours into next cycle)
  const hoursUntilNextEvent = cyclePositionInHours < 48 
    ? 48 - cyclePositionInHours 
    : 72 - cyclePositionInHours;
  
  return addHours(now, hoursUntilNextEvent);
}

export function getNextEventType(startDate: Date): "on" | "off" {
  const currentStatus = calculateCurrentStatus(startDate);
  return currentStatus === "on" ? "off" : "on";
}

export function getTimeUntilNextEvent(nextEventDate: Date): { hours: number, minutes: number } {
  const now = new Date();
  const hoursRemaining = differenceInHours(nextEventDate, now);
  const minutesRemaining = differenceInMinutes(nextEventDate, now) % 60;
  
  return {
    hours: hoursRemaining,
    minutes: minutesRemaining
  };
}

export function formatTimeRemaining(hours: number, minutes: number): string {
  return `${hours}h ${minutes}m`;
}

export function formatDateTime(date: Date): string {
  return format(date, 'EEEE, MMMM d, yyyy h:mm a');
}

export function formatTime(date: Date): string {
  return format(date, 'h:mm a');
}

export function getNextThreeEvents(startDate: Date): Array<{date: Date, type: "on" | "off"}> {
  const events = [];
  const currentStatus = calculateCurrentStatus(startDate);
  const nextEventDate = getNextEventDate(startDate);
  const nextEventType = getNextEventType(startDate);
  
  events.push({
    date: nextEventDate,
    type: nextEventType
  });
  
  // Calculate the second event
  const secondEventDate = nextEventType === "off" 
    ? addDays(nextEventDate, 1)  // If next is off, then on comes 1 day later
    : addDays(nextEventDate, 2); // If next is on, then off comes 2 days later
  
  events.push({
    date: secondEventDate,
    type: nextEventType === "off" ? "on" : "off"
  });
  
  // Calculate the third event
  const thirdEventDate = nextEventType === "off"
    ? addDays(secondEventDate, 2) // If second is on, then off comes 2 days later
    : addDays(secondEventDate, 1); // If second is off, then on comes 1 day later
    
  events.push({
    date: thirdEventDate,
    type: nextEventType === "off" ? "off" : "on"
  });
  
  return events;
}
