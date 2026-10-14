import { portfolioProjects } from "../data/siteData";

/** Trims and uppercases a Project ID so lookups ignore case and surrounding spaces. */
export function normalizeProjectId(value: string): string {
  return value.trim().toUpperCase();
}

/**
 * Looks up a Project ID in the existing portfolio data. Returns null when the
 * input is empty or matches no project. This is a read-only lookup, not a
 * separate registry.
 */
export function findPortfolioProject(value: string) {
  const id = normalizeProjectId(value);
  if (id === "") return null;
  return portfolioProjects.find((project) => normalizeProjectId(project.id) === id) ?? null;
}

export type PortfolioProjectMatch = NonNullable<ReturnType<typeof findPortfolioProject>>;
