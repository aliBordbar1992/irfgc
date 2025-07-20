export type EventStatusType =
  | "UPCOMING"
  | "ONGOING"
  | "COMPLETED"
  | "CANCELLED";

export type StatusOverrideType =
  | "AUTO"
  | "UPCOMING"
  | "ONGOING"
  | "COMPLETED"
  | "CANCELLED";

/**
 * Automatically determines the status of an event based on current date and event dates
 */
export function getAutomaticEventStatus(
  startDate: Date,
  endDate: Date,
  currentDate: Date = new Date()
): EventStatusType {
  // If current date is before start date, event is upcoming
  if (currentDate < startDate) {
    return "UPCOMING";
  }

  // If current date is between start and end date, event is ongoing
  if (currentDate >= startDate && currentDate <= endDate) {
    return "ONGOING";
  }

  // If current date is after end date, event is completed
  return "COMPLETED";
}

/**
 * Gets the effective status of an event, considering manual override
 */
export function getEffectiveEventStatus(
  startDate: Date,
  endDate: Date,
  statusOverride?: StatusOverrideType | null,
  currentDate: Date = new Date()
): EventStatusType {
  // If status is manually set to CANCELLED, respect it
  if (statusOverride === "CANCELLED") {
    return "CANCELLED";
  }

  // If there's a manual override (not AUTO), use it
  if (statusOverride && statusOverride !== "AUTO") {
    return statusOverride;
  }

  // Otherwise, use automatic status (AUTO or null/undefined)
  return getAutomaticEventStatus(startDate, endDate, currentDate);
}

/**
 * Checks if an event can be manually overridden
 */
export function canOverrideEventStatus(
  startDate: Date,
  endDate: Date,
  currentDate: Date = new Date()
): boolean {
  const automaticStatus = getAutomaticEventStatus(
    startDate,
    endDate,
    currentDate
  );

  // Allow override for all statuses except when event is completed and more than 24 hours have passed
  if (automaticStatus === "COMPLETED") {
    const hoursSinceEnd =
      (currentDate.getTime() - endDate.getTime()) / (1000 * 60 * 60);
    return hoursSinceEnd <= 24; // Allow override within 24 hours of completion
  }

  return true;
}

/**
 * Gets a human-readable description of the current event status
 */
export function getEventStatusDescription(
  status: EventStatusType,
  startDate: Date,
  endDate: Date,
  currentDate: Date = new Date()
): string {
  switch (status) {
    case "UPCOMING":
      const daysUntilStart = Math.ceil(
        (startDate.getTime() - currentDate.getTime()) / (1000 * 60 * 60 * 24)
      );
      if (daysUntilStart === 0) {
        return "Starting today";
      } else if (daysUntilStart === 1) {
        return "Starting tomorrow";
      } else {
        return `Starting in ${daysUntilStart} days`;
      }

    case "ONGOING":
      const hoursUntilEnd = Math.ceil(
        (endDate.getTime() - currentDate.getTime()) / (1000 * 60 * 60)
      );
      if (hoursUntilEnd <= 1) {
        return "Ending soon";
      } else if (hoursUntilEnd <= 24) {
        return `Ending in ${hoursUntilEnd} hours`;
      } else {
        const daysUntilEnd = Math.ceil(hoursUntilEnd / 24);
        return `Ending in ${daysUntilEnd} days`;
      }

    case "COMPLETED":
      const hoursSinceEnd = Math.floor(
        (currentDate.getTime() - endDate.getTime()) / (1000 * 60 * 60)
      );
      if (hoursSinceEnd < 1) {
        return "Just ended";
      } else if (hoursSinceEnd < 24) {
        return `Ended ${hoursSinceEnd} hours ago`;
      } else {
        const daysSinceEnd = Math.floor(hoursSinceEnd / 24);
        return `Ended ${daysSinceEnd} days ago`;
      }

    case "CANCELLED":
      return "Event cancelled";

    default:
      return "Unknown status";
  }
}
