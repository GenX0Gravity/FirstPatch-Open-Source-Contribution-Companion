import {
  clearChecklistState,
  loadAchievementState,
  loadChecklistState,
  loadContributions,
  saveAchievementState,
  saveChecklistState,
  saveContributions,
} from "./storage.js";
import { checklistItems, getProgress } from "./checklist.js";

const checklist = document.querySelector("#checklist");
const resetButton = document.querySelector("#reset-checklist");
const progressCount = document.querySelector("#progress-count");
const progressPercent = document.querySelector("#progress-percent");
const progressFill = document.querySelector("#progress-fill");
const progressBar = document.querySelector(".mini-progress");
const completionMessage = document.querySelector("#completion-message");
const contributionList = document.querySelector("#contribution-list");
const contributionEmptyState = document.querySelector("#contribution-empty-state");
const searchInput = document.querySelector("#contribution-search");
const statusFilter = document.querySelector("#status-filter");
const contributionModal = document.querySelector("#contribution-modal");
const contributionForm = document.querySelector("#contribution-form");
const modalTitle = document.querySelector("#modal-title");
const formMessage = document.querySelector("#form-message");
const openModalButton = document.querySelector("#open-contribution-modal");
const closeModalButton = document.querySelector("#close-contribution-modal");
const cancelModalButton = document.querySelector("#cancel-contribution");
const resetDemoButton = document.querySelector("#reset-demo-data");
const mobileResetDemoButton = document.querySelector("#reset-demo-data-mobile");
const savedRepositoriesStat = document.querySelector("#saved-repositories-stat");
const issuesToExploreStat = document.querySelector("#issues-to-explore-stat");
const completedContributionsStat = document.querySelector("#completed-contributions-stat");
const achievementToast = document.querySelector("#achievement-toast");

let completedIds = loadChecklistState().filter((id) =>
  checklistItems.some((item) => item.id === id),
);
const demoContributions = [
  {
    id: "demo-open-source-labs",
    repositoryName: "open-source-labs",
    repositoryUrl: "https://github.com/open-source-labs",
    issueTitle: "Improve the getting started guide",
    issueUrl: "https://github.com/open-source-labs/community/issues/12",
    language: "JavaScript",
    difficulty: "Beginner",
    status: "In Progress",
  },
  {
    id: "demo-community-components",
    repositoryName: "community-components",
    repositoryUrl: "https://github.com/community-components",
    issueTitle: "Add a tooltip example",
    issueUrl: "https://github.com/community-components/ui/issues/8",
    language: "CSS",
    difficulty: "Beginner",
    status: "To Explore",
  },
  {
    id: "demo-docs-for-all",
    repositoryName: "docs-for-all",
    repositoryUrl: "https://github.com/docs-for-all",
    issueTitle: "Fix broken installation link",
    issueUrl: "https://github.com/docs-for-all/docs/issues/24",
    language: "Markdown",
    difficulty: "Beginner",
    status: "To Explore",
  },
];
let contributions = loadContributions();
let achievementState = loadAchievementState();
let editingContributionId = null;
let lastFocusedElement = null;

function updateProgress() {
  const { completedCount, totalCount, percentage } = getProgress(completedIds);

  progressCount.textContent = `${completedCount} of ${totalCount}`;
  progressPercent.textContent = `${percentage}%`;
  progressFill.style.width = `${percentage}%`;
  progressBar.setAttribute("aria-valuenow", String(percentage));
  completionMessage.textContent =
    percentage === 100
      ? "You did it! Your first patch is ready to share."
      : "";
}

function updateContributionStats() {
  const repositoryUrls = new Set(contributions.map((contribution) => contribution.repositoryUrl));
  savedRepositoriesStat.textContent = String(repositoryUrls.size);
  issuesToExploreStat.textContent = String(
    contributions.filter((contribution) => contribution.status === "To Explore").length,
  );
  completedContributionsStat.textContent = String(
    contributions.filter((contribution) => contribution.status === "Completed").length,
  );
}

function getRealContributions() {
  return contributions.filter((contribution) => !contribution.id.startsWith("demo-"));
}

function showAchievementToast(title) {
  achievementToast.textContent = `Achievement unlocked: ${title}`;
  achievementToast.hidden = false;
  window.setTimeout(() => {
    achievementToast.hidden = true;
  }, 4000);
}

function updateAchievements({ notify = false } = {}) {
  const realContributions = getRealContributions();
  const nextAchievementState = {
    "first-issue-saved": realContributions.length > 0,
    "first-checklist-completed": completedIds.length > 0,
    "three-contributions": realContributions.length >= 3,
    "first-contribution-completed": realContributions.some(
      (contribution) => contribution.status === "Completed",
    ),
    "pr-preparation-complete": completedIds.length === checklistItems.length,
  };
  const unlockedAchievements = Object.fromEntries(
    Object.keys(nextAchievementState).map((id) => [
      id,
      achievementState.unlocked[id] === true || nextAchievementState[id],
    ]),
  );

  const newlyUnlocked = Object.entries(nextAchievementState).find(
    ([id, isUnlocked]) =>
      notify &&
      isUnlocked &&
      achievementState.unlocked[id] !== true &&
      achievementState.notified[id] !== true,
  );
  achievementState = {
    unlocked: { ...achievementState.unlocked, ...unlockedAchievements },
    notified: { ...achievementState.notified },
  };
  if (newlyUnlocked) {
    const achievement = document.querySelector(
      `[data-achievement-id="${newlyUnlocked[0]}"]`,
    );
    const title = achievement?.querySelector("strong")?.textContent || "New badge";
    achievementState.notified[newlyUnlocked[0]] = true;
    showAchievementToast(title);
  }
  saveAchievementState(achievementState);
  document.querySelectorAll("[data-achievement-id]").forEach((achievement) => {
    const isUnlocked = achievementState.unlocked[achievement.dataset.achievementId] === true;
    achievement.classList.toggle("unlocked", isUnlocked);
    achievement.classList.toggle("locked", !isUnlocked);
    const stateIcon = achievement.querySelector(".badge-check, .lock-icon");
    if (!stateIcon) return;
    stateIcon.textContent = isUnlocked ? "✓" : "▣";
    stateIcon.className = isUnlocked ? "badge-check" : "lock-icon";
    stateIcon.setAttribute("aria-label", isUnlocked ? "Unlocked" : "Locked");
  });
}

function getStatusClass(status) {
  return {
    "To Explore": "status-new",
    "In Progress": "status-progress",
    Completed: "status-saved",
  }[status];
}

function getLanguageClass(language) {
  return `language-${language.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`;
}

function isContribution(value) {
  return value &&
    ["id", "repositoryName", "repositoryUrl", "issueTitle", "issueUrl", "language", "difficulty", "status"]
      .every((field) => typeof value[field] === "string") &&
      isValidHttpUrl(value.repositoryUrl) &&
      isValidHttpUrl(value.issueUrl) &&
    ["Beginner", "Intermediate", "Advanced"].includes(value.difficulty) &&
    ["To Explore", "In Progress", "Completed"].includes(value.status);
}

function createTaskRow(contribution) {
  const row = document.createElement("article");
  row.className = "task-row";
  row.dataset.contributionId = contribution.id;

  const avatar = document.createElement("div");
  avatar.className = "repo-avatar repo-blue";
  avatar.textContent = contribution.repositoryName.charAt(0).toUpperCase();
  avatar.setAttribute("aria-hidden", "true");

  const details = document.createElement("div");
  details.className = "task-details";

  const repositoryLink = document.createElement("a");
  repositoryLink.href = contribution.repositoryUrl;
  repositoryLink.target = "_blank";
  repositoryLink.rel = "noreferrer";
  repositoryLink.textContent = contribution.repositoryName;

  const title = document.createElement("h3");
  const issueLink = document.createElement("a");
  issueLink.href = contribution.issueUrl;
  issueLink.target = "_blank";
  issueLink.rel = "noreferrer";
  issueLink.textContent = contribution.issueTitle;
  title.append(issueLink);

  const metadata = document.createElement("div");
  metadata.className = "task-meta";
  const language = document.createElement("span");
  language.className = `tag ${getLanguageClass(contribution.language)}`;
  language.textContent = contribution.language;
  const difficulty = document.createElement("span");
  difficulty.className = "difficulty";
  difficulty.textContent = contribution.difficulty;
  metadata.append(language, difficulty);
  details.append(repositoryLink, title, metadata);

  const status = document.createElement("span");
  status.className = `status ${getStatusClass(contribution.status)}`;
  status.textContent = contribution.status;

  const actions = document.createElement("div");
  actions.className = "task-actions";
  ["Edit", "Delete"].forEach((action) => {
    const button = document.createElement("button");
    button.className = "task-action";
    button.type = "button";
    button.dataset.action = action.toLowerCase();
    button.textContent = action;
    button.setAttribute("aria-label", `${action} ${contribution.issueTitle}`);
    actions.append(button);
  });

  row.append(avatar, details, status, actions);
  return row;
}

function renderContributions() {
  const query = searchInput.value.trim().toLowerCase();
  const selectedStatus = statusFilter.value;
  const visibleContributions = contributions.filter((contribution) => {
    const matchesQuery =
      !query ||
      contribution.repositoryName.toLowerCase().includes(query) ||
      contribution.issueTitle.toLowerCase().includes(query);
    const matchesStatus = selectedStatus === "all" || contribution.status === selectedStatus;
    return matchesQuery && matchesStatus;
  });

  contributionList.replaceChildren(...visibleContributions.map(createTaskRow));
  contributionEmptyState.hidden = visibleContributions.length !== 0;
  updateContributionStats();
}

function setFieldErrors(errors = {}) {
  contributionForm.querySelectorAll(".field-error").forEach((element) => {
    element.textContent = errors[element.dataset.errorFor] || "";
  });
}

function isValidHttpUrl(value) {
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

function validateContribution(data) {
  const errors = {};
  ["repositoryName", "repositoryUrl", "issueTitle", "issueUrl", "language", "difficulty", "status"].forEach(
    (field) => {
      if (!data[field]) {
        errors[field] = "This field is required.";
      }
    },
  );
  ["repositoryUrl", "issueUrl"].forEach((field) => {
    if (data[field] && !isValidHttpUrl(data[field])) {
      errors[field] = "Enter a valid http(s) URL.";
    }
  });
  return errors;
}

function openContributionModal(contribution = null) {
  lastFocusedElement = document.activeElement;
  editingContributionId = contribution?.id || null;
  modalTitle.textContent = contribution ? "Edit contribution" : "Add contribution";
  contributionForm.reset();
  setFieldErrors();
  formMessage.textContent = "";
  if (contribution) {
    Object.entries(contribution).forEach(([field, value]) => {
      const input = contributionForm.elements[field];
      if (input) input.value = value;
    });
  }
  contributionModal.hidden = false;
  document.body.classList.add("modal-open");
  contributionForm.elements.repositoryName.focus();
}

function closeContributionModal() {
  contributionModal.hidden = true;
  document.body.classList.remove("modal-open");
  editingContributionId = null;
  if (lastFocusedElement instanceof HTMLElement) lastFocusedElement.focus();
}

function renderChecklist() {
  checklist.querySelectorAll("input[type='checkbox']").forEach((checkbox) => {
    checkbox.checked = completedIds.includes(checkbox.dataset.checklistId);
  });
  updateProgress();
}

checklist.addEventListener("change", (event) => {
  const checkbox = event.target.closest("input[type='checkbox']");
  if (!checkbox) {
    return;
  }

  const { checklistId } = checkbox.dataset;
  completedIds = checkbox.checked
    ? [...new Set([...completedIds, checklistId])]
    : completedIds.filter((id) => id !== checklistId);
  saveChecklistState(completedIds);
  updateProgress();
  updateAchievements({ notify: true });
});

resetButton.addEventListener("click", () => {
  if (!window.confirm("Reset your checklist progress?")) return;
  completedIds = [];
  clearChecklistState();
  renderChecklist();
  updateAchievements();
});

function resetDemoData() {
  const shouldReset = window.confirm(
    "Reset demo data? This will replace your saved contributions, checklist progress, and achievement states with the starter demo.",
  );
  if (!shouldReset) return;

  contributions = demoContributions.map((contribution) => ({ ...contribution }));
  completedIds = [];
  achievementState = { unlocked: {}, notified: {} };
  searchInput.value = "";
  statusFilter.value = "all";
  saveContributions(contributions);
  saveChecklistState(completedIds);
  saveAchievementState(achievementState);
  renderContributions();
  renderChecklist();
}

resetDemoButton.addEventListener("click", resetDemoData);
mobileResetDemoButton.addEventListener("click", resetDemoData);

contributionList.addEventListener("click", (event) => {
  const button = event.target.closest("button[data-action]");
  if (!button) return;
  const row = button.closest("[data-contribution-id]");
  const contribution = contributions.find((item) => item.id === row.dataset.contributionId);
  if (!contribution) return;

  if (button.dataset.action === "edit") {
    openContributionModal(contribution);
  } else if (window.confirm(`Delete "${contribution.issueTitle}"?`)) {
    contributions = contributions.filter((item) => item.id !== contribution.id);
    saveContributions(contributions);
    renderContributions();
    updateAchievements({ notify: true });
  }
});

contributionForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const data = Object.fromEntries(new FormData(contributionForm).entries());
  const errors = validateContribution(data);
  setFieldErrors(errors);
  if (Object.keys(errors).length > 0) {
    formMessage.textContent = "Please fix the highlighted fields.";
    contributionForm.querySelector(".field-error:not(:empty)")?.previousElementSibling?.focus();
    return;
  }

  const duplicateContribution = contributions.find(
    (contribution) =>
      contribution.id !== editingContributionId &&
      contribution.repositoryUrl === data.repositoryUrl &&
      contribution.issueUrl === data.issueUrl,
  );
  if (duplicateContribution) {
    formMessage.textContent = "This repository issue is already being tracked.";
    return;
  }

  if (editingContributionId) {
    contributions = contributions.map((contribution) =>
      contribution.id === editingContributionId
        ? { ...contribution, ...data }
        : contribution,
    );
  } else {
    contributions = [{ ...data, id: `contribution-${Date.now()}` }, ...contributions];
  }
  saveContributions(contributions);
  renderContributions();
  updateAchievements({ notify: true });
  closeContributionModal();
});

searchInput.addEventListener("input", renderContributions);
statusFilter.addEventListener("change", renderContributions);
openModalButton.addEventListener("click", () => openContributionModal());
closeModalButton.addEventListener("click", closeContributionModal);
cancelModalButton.addEventListener("click", closeContributionModal);
contributionModal.addEventListener("click", (event) => {
  if (event.target === contributionModal) closeContributionModal();
});
document.addEventListener("keydown", (event) => {
  if (contributionModal.hidden) return;
  if (event.key === "Escape") {
    closeContributionModal();
    return;
  }
  if (event.key !== "Tab") return;

  const focusableElements = [...contributionModal.querySelectorAll(
    "button, input, select, a[href], [tabindex]:not([tabindex='-1'])",
  )].filter((element) => !element.hasAttribute("disabled"));
  const firstElement = focusableElements[0];
  const lastElement = focusableElements.at(-1);
  if (!firstElement || !lastElement) return;
  if (event.shiftKey && document.activeElement === firstElement) {
    event.preventDefault();
    lastElement.focus();
  } else if (!event.shiftKey && document.activeElement === lastElement) {
    event.preventDefault();
    firstElement.focus();
  }
});

if (contributions === null) {
  contributions = demoContributions.map((contribution) => ({ ...contribution }));
  saveContributions(contributions);
}
const validContributions = contributions.filter(isContribution);
const seenContributionIds = new Set();
contributions = validContributions.filter((contribution) => {
  if (seenContributionIds.has(contribution.id)) return false;
  seenContributionIds.add(contribution.id);
  return true;
});
if (contributions.length !== validContributions.length) {
  saveContributions(contributions);
}
renderContributions();
renderChecklist();
updateAchievements();
