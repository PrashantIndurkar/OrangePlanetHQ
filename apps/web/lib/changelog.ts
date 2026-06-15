import { staticReleases, rawMarkdown as staticRawMarkdown } from "./changelog-data";

export interface ChangelogRelease {
	version: string;
	date: string;
	compareUrl?: string;
	contentHtml: string;
}

export function getChangelogFilePath(): string {
	return "";
}

export function getChangelogData(): ChangelogRelease[] {
	return staticReleases;
}

export function getRawMarkdown(): string {
	return staticRawMarkdown;
}
