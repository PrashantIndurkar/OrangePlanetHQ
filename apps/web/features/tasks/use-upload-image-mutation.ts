import { useMutation } from "@tanstack/react-query";
import { uploadImage } from "@/lib/upload-image";

export function useUploadImageMutation() {
	return useMutation({
		mutationFn: (file: File) => uploadImage(file),
		retry: false,
	});
}
