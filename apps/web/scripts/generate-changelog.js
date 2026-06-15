import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { marked } from "marked";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function generateStaticChangelog() {
	const changelogPath = path.resolve(__dirname, "../../../CHANGELOG.md");
	const outputPath = path.resolve(__dirname, "../lib/changelog-data.ts");

	if (!fs.existsSync(changelogPath)) {
		console.warn("⚠️ CHANGELOG.md not found at " + changelogPath + ". Skipping static generation.");
		return;
	}

	const fileContent = fs.readFileSync(changelogPath, "utf-8");
	const cleanContent = fileContent.startsWith("# ")
		? fileContent.substring(2)
		: fileContent;
	
	const sections = cleanContent.split(/\n# /);
	const releases = [];

	for (let section of sections) {
		section = section.trim();
		if (!section) continue;

		const lines = section.split("\n");
		const headerLine = lines[0].trim();

		let version = "Unknown";
		let date = "";
		let compareUrl = "";

		const linkMatch = headerLine.match(/\[([^\]]+)\]\(([^)]+)\)/);
		if (linkMatch) {
			version = linkMatch[1];
			compareUrl = linkMatch[2];
		} else {
			const versionMatch = headerLine.match(/^([^\s(]+)/);
			if (versionMatch) {
				version = versionMatch[1];
			}
		}

		const dateMatch = headerLine.match(/\(([^)]+)\)$/);
		if (dateMatch) {
			date = dateMatch[1];
		}

		const bodyText = lines.slice(1).join("\n").trim();
		const contentHtml = marked.parse(bodyText);

		releases.push({
			version,
			date,
			compareUrl: compareUrl || undefined,
			contentHtml,
		});
	}

	const tsContent = `// This file is auto-generated from CHANGELOG.md. Do not edit directly.
export interface ChangelogRelease {
	version: string;
	date: string;
	compareUrl?: string;
	contentHtml: string;
}

export const staticReleases: ChangelogRelease[] = ${JSON.stringify(releases, null, 2)};

export const rawMarkdown = ${JSON.stringify(fileContent)};
`;

	fs.writeFileSync(outputPath, tsContent, "utf-8");
	console.log("✅ Successfully auto-generated apps/web/lib/changelog-data.ts from CHANGELOG.md");
}

generateStaticChangelog();
