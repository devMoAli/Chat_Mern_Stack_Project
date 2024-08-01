// Function to extract time from date string
export function extractTime(dateString) {
  const date = new Date(dateString);
  const dayName = getDayName(date.getDay());
  const hours = padZero(date.getHours());
  const minutes = padZero(date.getMinutes());
  return `${dayName}-${hours}:${minutes}`;
}

// Helper function to pad single-digit numbers with a leading zero
function padZero(number) {
  return number.toString().padStart(2, "0");
}
// Function to get day name from day index (0-6, where 0 is Sunday)
function getDayName(dayIndex) {
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  return days[dayIndex];
}
