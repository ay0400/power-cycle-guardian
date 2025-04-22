
export interface PowerCycle {
  startDate: Date; // When the user initialized their cycle
  currentStatus: "on" | "off"; // Current power status
  nextEvent: Date; // Next time the power changes state
}

export interface Settings {
  notificationsEnabled: boolean;
  notificationLeadTime: number; // Minutes before event to notify
}
