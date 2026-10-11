export const checklistItems = [
  { id: "read", title: "Read the repository guide" },
  { id: "issue", title: "Choose an appropriate issue" },
  { id: "fork-clone", title: "Fork and clone the repository" },
  { id: "branch", title: "Create a new branch" },
  { id: "change", title: "Make a focused change" },
  { id: "test-diff", title: "Run tests and inspect the diff" },
  { id: "commit", title: "Commit with a clear message" },
  { id: "pull-request", title: "Push and open a pull request" },
  { id: "review", title: "Respond to review feedback" },
];

export function getCompletedItems(completedIds) {
  return checklistItems.filter((item) => completedIds.includes(item.id));
}

export function getProgress(completedIds) {
  const completedCount = getCompletedItems(completedIds).length;
  return {
    completedCount,
    totalCount: checklistItems.length,
    percentage: Math.round((completedCount / checklistItems.length) * 100),
  };
}
