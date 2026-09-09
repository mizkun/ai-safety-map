const DAY = 86_400_000;

/** @param {Date} [now] */
export function currentReviewDay(now = new Date()) {
  // Review dates use the project's calendar (Asia/Tokyo), including in CI.
  return new Date(now.getTime() + 9 * 60 * 60 * 1000)
    .toISOString()
    .slice(0, 10);
}

/** @param {string} value */
export function isCalendarDate(value) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const parsed = new Date(value + 'T00:00:00Z');
  return (
    !Number.isNaN(parsed.getTime()) &&
    parsed.toISOString().slice(0, 10) === value
  );
}

/**
 * @param {import('./content-types').Review} review
 * @param {string} today
 */
export function reviewStatus(review, today) {
  if (
    !isCalendarDate(review.checkedAt) ||
    !isCalendarDate(today) ||
    !Number.isInteger(review.intervalDays) ||
    review.intervalDays < 1
  ) {
    throw new Error('Invalid review date or interval');
  }
  const due =
    Date.parse(review.checkedAt + 'T00:00:00Z') + review.intervalDays * DAY;
  const daysRemaining = Math.round(
    (due - Date.parse(today + 'T00:00:00Z')) / DAY,
  );
  return {
    dueAt: new Date(due).toISOString().slice(0, 10),
    daysRemaining,
    state:
      daysRemaining <= 0 ? 'due' : daysRemaining <= 2 ? 'soon' : 'scheduled',
  };
}
