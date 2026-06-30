export async function uploadImage(
	file: File,
): Promise<{ url: string; publicId: string }> {
	await new Promise((resolve) => setTimeout(resolve, 800));

	const url = URL.createObjectURL(file);

	return {
		url,
		publicId: `mock-img-${Math.random().toString(36).slice(2, 11)}`,
	};
}
