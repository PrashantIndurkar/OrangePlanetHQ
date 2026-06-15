import { apiFetch } from "./api/client";

export async function uploadImage(
	file: File,
): Promise<{ url: string; publicId: string }> {
	const formData = new FormData();
	formData.append("file", file);

	return apiFetch<{ url: string; publicId: string }>("/uploads/image", {
		method: "POST",
		body: formData,
	});
}
