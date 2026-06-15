import fs from "node:fs";
import path from "node:path";
import { marked } from "marked";

export interface ChangelogRelease {
	version: string;
	date: string;
	compareUrl?: string;
	contentHtml: string;
}

export function getChangelogData(): ChangelogRelease[] {
	const filePath = path.join(process.cwd(), "../../CHANGELOG.md");
	if (!fs.existsSync(filePath)) {
		return [];
	}
	const fileContent = fs.readFileSync(filePath, "utf-8");

	// Split the file content by `# ` headers (each release begins with a main header)
	// We handle both the absolute file start and subsequent splits
	const cleanContent = fileContent.startsWith("# ")
		? fileContent.substring(2)
		: fileContent;
	const sections = cleanContent.split(/\n# /);
	const releases: ChangelogRelease[] = [];

	for (let section of sections) {
		section = section.trim();
		if (!section) continue;

		const lines = section.split("\n");
		const headerLine = lines[0].trim();

		let version = "Unknown";
		let date = "";
		let compareUrl = "";

		// Regex to match markdown link e.g. [0.15.0](https://github.com/...)
		const linkMatch = headerLine.match(/\[([^\]]+)\]\(([^)]+)\)/);
		if (linkMatch) {
			version = linkMatch[1];
			compareUrl = linkMatch[2];
		} else {
			// Plain version string e.g. 0.4.0
			const versionMatch = headerLine.match(/^([^\s(]+)/);
			if (versionMatch) {
				version = versionMatch[1];
			}
		}

		// Extract date enclosed in brackets at the end of the line, e.g. (2026-06-15)
		const dateMatch = headerLine.match(/\(([^)]+)\)$/);
		if (dateMatch) {
			date = dateMatch[1];
		}

		const bodyText = lines.slice(1).join("\n").trim();
		const contentHtml = marked.parse(bodyText) as string;

		releases.push({
			version,
			date,
			compareUrl: compareUrl || undefined,
			contentHtml,
		});
	}

	return releases;
}
