export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
export const IMGBB_API_KEY = import.meta.env.VITE_IMGBB_API_KEY || '714b4ad18d0cf4ce255329888f21797d';

export async function uploadImageToImgbb(file) {
	if (!file) {
		throw new Error('Image file is required');
	}

	const formData = new FormData();
	formData.append('image', file);

	const response = await fetch(`https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`, {
		method: 'POST',
		body: formData,
	});

	const data = await response.json();

	if (!response.ok || !data?.success) {
		throw new Error(data?.error?.message || 'Image upload failed');
	}

	return data?.data?.display_url || data?.data?.url;
}

export async function uploadMultipleImagesToImgbb(files = []) {
	if (!files.length) {
		return [];
	}

	const uploadTasks = files.map((file) => uploadImageToImgbb(file));
	return Promise.all(uploadTasks);
}
