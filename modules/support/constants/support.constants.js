"use strict";

const OWNER_STATUSES = new Set([
  "Sent",
  "Review",
  "InDiscussion",
  "Development",
  "Testing",
  "Done",
  "Delivered",
]);

const ADMIN_STATUSES = new Set([
  "Backlog",
  "Todo",
  "InProgress",
  "DoneOnLocal",
  "ReadyForTesting",
  "Done",
  "Delivered",
  "Cancelled",
]);

const PRIORITIES = new Set(["Low", "Medium", "High", "Urgent"]);

const TITLE_MIN = 3;
const TITLE_MAX = 50;
const BODY_MIN = 10;
const BODY_MAX = 1000;

const MAX_COMMENT_IMAGES = 3;

const OWNER_STATUS_LABELS = {
  Sent: "Sent",
  Review: "Review",
  InDiscussion: "In discussion",
  Development: "Development",
  Testing: "Testing",
  Done: "Done",
  Delivered: "Delivered",
};

const ADMIN_STATUS_LABELS = {
  Backlog: "Backlog",
  Todo: "To do",
  InProgress: "In progress",
  DoneOnLocal: "Done on local",
  ReadyForTesting: "Ready for testing",
  Done: "Done",
  Delivered: "Delivered",
  Cancelled: "Cancelled",
};

const PRIORITY_LABELS = {
  Low: "Low",
  Medium: "Medium",
  High: "High",
  Urgent: "Urgent",
};

module.exports = {
  OWNER_STATUSES,
  ADMIN_STATUSES,
  PRIORITIES,
  TITLE_MIN,
  TITLE_MAX,
  BODY_MIN,
  BODY_MAX,
  MAX_COMMENT_IMAGES,
  OWNER_STATUS_LABELS,
  ADMIN_STATUS_LABELS,
  PRIORITY_LABELS,
};
