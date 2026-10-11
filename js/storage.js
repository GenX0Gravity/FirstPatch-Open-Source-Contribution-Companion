const STORAGE_VERSION = 1;
const STORAGE_KEYS = {
  checklist: "firstpatch.checklist",
  contributions: "firstpatch.contributions",
  achievements: "firstpatch.achievements",
};

function readVersionedValue(key, fallback, isValid) {
  try {
    const rawValue = localStorage.getItem(key);
    if (rawValue === null) return fallback;

    const parsedValue = JSON.parse(rawValue);

    // Migrate the arrays written by the first version of FirstPatch.
    if (Array.isArray(parsedValue)) {
      if (!isValid(parsedValue)) return fallback;
      writeVersionedValue(key, parsedValue);
      return parsedValue;
    }

    function isBooleanMap(value) {
      return (
        value &&
        typeof value === "object" &&
        !Array.isArray(value) &&
        Object.values(value).every((state) => typeof state === "boolean")
      );
    }

    if (
      parsedValue?.version === STORAGE_VERSION &&
      isValid(parsedValue.data)
    ) {
      return parsedValue.data;
    }
  } catch {
    return fallback;
  }

  return fallback;
}

function writeVersionedValue(key, data) {
  try {
    localStorage.setItem(
      key,
      JSON.stringify({ version: STORAGE_VERSION, data }),
    );
  } catch {
    // The in-memory application state remains usable when storage is unavailable.
  }
}

export function loadChecklistState() {
  return readVersionedValue(
    STORAGE_KEYS.checklist,
    [],
    (value) => Array.isArray(value) && value.every((item) => typeof item === "string"),
  );
}

export function saveChecklistState(completedIds) {
  writeVersionedValue(STORAGE_KEYS.checklist, completedIds);
}

export function clearChecklistState() {
  saveChecklistState([]);
}

export function loadContributions() {
  try {
    const rawValue = localStorage.getItem(STORAGE_KEYS.contributions);
    if (rawValue === null) return null;

    const parsedValue = JSON.parse(rawValue);
    if (Array.isArray(parsedValue)) {
      writeVersionedValue(STORAGE_KEYS.contributions, parsedValue);
      return parsedValue;
    }
    if (parsedValue?.version === STORAGE_VERSION && Array.isArray(parsedValue.data)) {
      return parsedValue.data;
    }
  } catch {
    // Treat malformed saved contributions as an empty user dataset.
  }
  return [];
}

export function saveContributions(contributions) {
  writeVersionedValue(STORAGE_KEYS.contributions, contributions);
}

export function loadAchievementState() {
  const savedState = readVersionedValue(
    STORAGE_KEYS.achievements,
    {},
    (value) =>
      value &&
      typeof value === "object" &&
      !Array.isArray(value) &&
      (isBooleanMap(value) ||
        (isBooleanMap(value.unlocked) && isBooleanMap(value.notified))),
  );

  if (Object.values(savedState).every((state) => typeof state === "boolean")) {
    return { unlocked: savedState, notified: {} };
  }

  return {
    unlocked: isBooleanMap(savedState.unlocked) ? savedState.unlocked : {},
    notified: isBooleanMap(savedState.notified) ? savedState.notified : {},
  };
}

export function saveAchievementState(achievementState) {
  writeVersionedValue(STORAGE_KEYS.achievements, achievementState);
}
