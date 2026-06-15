import fs from "node:fs";
import path from "node:path";

export interface RoadmapItem {
	title: string;
	status: string;
	priority: string;
	description: string;
	icon?: string;
}

export interface RoadmapData {
	title: string;
	description: string;
	categories: {
		[category: string]: RoadmapItem[];
	};
}

export function getRoadmapData(): RoadmapData {
	const filePath = path.join(process.cwd(), "content/roadmap.md");
	const fileContent = fs.readFileSync(filePath, "utf-8");

	const lines = fileContent.split("\n");
	let title = "Product Roadmap";
	let description = "";
	let currentCategory = "";
	let currentItem: Partial<RoadmapItem> | null = null;

	const categories: { [key: string]: RoadmapItem[] } = {
		"In Progress": [],
		Planned: [],
		Completed: [],
	};

	let lineIndex = 0;
	if (lines[0]?.startsWith("# ")) {
		title = lines[0].substring(2).trim();
		lineIndex = 1;
	}

	while (lineIndex < lines.length && !lines[lineIndex].startsWith("## ")) {
		const line = lines[lineIndex].trim();
		if (line && !line.startsWith("---")) {
			if (description) description += " ";
			description += line;
		}
		lineIndex++;
	}

	for (let i = lineIndex; i < lines.length; i++) {
		const line = lines[i].trim();
		if (line.startsWith("## [")) {
			if (currentItem && currentCategory) {
				categories[currentCategory] = categories[currentCategory] || [];
				categories[currentCategory].push(currentItem as RoadmapItem);
			}
			currentCategory = line.replace("## [", "").replace("]", "").trim();
			currentItem = null;
		} else if (line.startsWith("### ")) {
			if (currentItem && currentCategory) {
				categories[currentCategory] = categories[currentCategory] || [];
				categories[currentCategory].push(currentItem as RoadmapItem);
			}
			const rawTitle = line.substring(4).trim();
			// Extract emoji icon if present
			const emojiMatch = rawTitle.match(
				/^([\u2700-\u27BF]|[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD10-\uDDFF])/g,
			);
			const emoji = emojiMatch ? emojiMatch[0] : undefined;
			const cleanTitle = emoji
				? rawTitle.substring(emoji.length).trim()
				: rawTitle;

			currentItem = {
				title: cleanTitle,
				icon: emoji || "✨",
				description: "",
				status: currentCategory,
				priority: "Medium",
			};
		} else if (currentItem && line.startsWith("- **Status:**")) {
			currentItem.status = line.replace("- **Status:**", "").trim();
		} else if (currentItem && line.startsWith("- **Priority:**")) {
			currentItem.priority = line.replace("- **Priority:**", "").trim();
		} else if (currentItem && line.startsWith("- **Description:**")) {
			currentItem.description = line.replace("- **Description:**", "").trim();
		} else if (currentItem && line.startsWith("- ")) {
			const text = line.substring(2).trim();
			if (currentItem.description) {
				currentItem.description += `\n${text}`;
			} else {
				currentItem.description = text;
			}
		} else if (currentItem && line) {
			if (!line.startsWith("---")) {
				if (currentItem.description) {
					currentItem.description += ` ${line}`;
				} else {
					currentItem.description = line;
				}
			}
		}
	}

	if (currentItem && currentCategory) {
		categories[currentCategory] = categories[currentCategory] || [];
		categories[currentCategory].push(currentItem as RoadmapItem);
	}

	return {
		title,
		description,
		categories,
	};
}
