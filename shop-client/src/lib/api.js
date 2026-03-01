const FALLBACK_API_BASE_URL = import.meta.env.PROD
	? 'https://shop-server-lemon.vercel.app'
	: 'http://localhost:8000';

export const API_BASE_URL = import.meta.env.VITE_API_URL || FALLBACK_API_BASE_URL;
export const IMGBB_API_KEY = import.meta.env.VITE_IMGBB_API_KEY || '714b4ad18d0cf4ce255329888f21797d';
export const ADMIN_TOKEN_KEY = 'admin_access_token';

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

export function setAdminToken(token) {
	localStorage.setItem(ADMIN_TOKEN_KEY, token);
}

export function getAdminToken() {
	return localStorage.getItem(ADMIN_TOKEN_KEY);
}

export function clearAdminToken() {
	localStorage.removeItem(ADMIN_TOKEN_KEY);
}

export function isAdminAuthenticated() {
	return Boolean(getAdminToken());
}

export async function adminApiFetch(path, options = {}) {
	const token = getAdminToken();

	if (!token) {
		throw new Error('Unauthorized');
	}

	const response = await fetch(`${API_BASE_URL}${path}`, {
		...options,
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${token}`,
			...(options.headers || {}),
		},
	});

	if (response.status === 401) {
		clearAdminToken();
		throw new Error('Unauthorized');
	}

	return response;
}
