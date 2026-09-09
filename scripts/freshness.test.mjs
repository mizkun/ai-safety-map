import assert from 'node:assert/strict';
import test from 'node:test';
import {
  currentReviewDay,
  isCalendarDate,
  reviewStatus,
} from '../lib/freshness.mjs';

test('deadline starts on its calendar day and does not imply correctness', () => {
  const review = {
    checkedAt: '2026-09-09',
    intervalDays: 7,
    reason: 'Capability review',
  };
  assert.equal(reviewStatus(review, '2026-09-13').state, 'scheduled');
  assert.equal(reviewStatus(review, '2026-09-14').state, 'soon');
  assert.deepEqual(reviewStatus(review, '2026-09-16'), {
    dueAt: '2026-09-16',
    daysRemaining: 0,
    state: 'due',
  });
  assert.equal(reviewStatus(review, '2026-10-01').daysRemaining, -15);
});

test('calendar arithmetic works across leap days and years', () => {
  assert.equal(
    reviewStatus({ checkedAt: '2028-02-28', intervalDays: 2 }, '2028-02-29')
      .dueAt,
    '2028-03-01',
  );
  assert.equal(
    reviewStatus({ checkedAt: '2026-12-31', intervalDays: 7 }, '2027-01-01')
      .dueAt,
    '2027-01-07',
  );
  assert.equal(isCalendarDate('2026-02-30'), false);
  assert.equal(isCalendarDate('2028-02-29'), true);
  assert.throws(() =>
    reviewStatus({ checkedAt: '2026-02-30', intervalDays: 7 }, '2026-03-01'),
  );
});

test('browser and scheduled checks share the Japanese date', () => {
  assert.equal(
    currentReviewDay(new Date('2026-09-09T14:59:59Z')),
    '2026-09-09',
  );
  assert.equal(
    currentReviewDay(new Date('2026-09-09T15:00:00Z')),
    '2026-09-10',
  );
});
