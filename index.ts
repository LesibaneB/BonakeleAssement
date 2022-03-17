import * as https from 'https';

const convertAnyToString = (value: any): string => {
	if (typeof value === 'string' || value instanceof String) {
		return value as string;
	} else {
		return JSON.stringify(value) as string;
	}
};

const padLeft = (value: string, padChar: string, padLength: number): string => {
	// get the pad character
	padChar = padChar[0] || ' ';

	// add the padChar until the length of value is the desired length or bigger
	while (value.length < padLength) {
		value = padChar + value;
	}

	// return the padded result
	return value;
};

const dateToString = (date: Date, includeDate: boolean = true, includeTime: boolean = true): string => {
	// Using this format to avoid UTC changes, using toISOString() and substringing will potentially cause issues with timezones causing the date to be 1 day behind
	let dateString = includeDate
		? padLeft(date.getFullYear() + '', '0', 4) +
		'-' +
		padLeft(date.getMonth() + 1 + '', '0', 2) +
		'-' +
		padLeft(date.getDate() + '', '0', 2)
		: '';

	if (dateString.length && includeTime) dateString += ' ';

	dateString += includeTime
		? padLeft(date.getHours() + '', '0', 2) +
		':' +
		padLeft(date.getMinutes() + '', '0', 2) +
		':' +
		padLeft(date.getSeconds() + '', '0', 2)
		: '';
	return dateString;
};

const convertToBoolean = (value: string | number | boolean | undefined | null) => {
	const valueNumber = Number(value ?? 0);
	return !!(Number.isNaN(valueNumber) ? (value ?? '').toString().toLowerCase() === 'true' : valueNumber);
};

const index = <T, K extends keyof T>(array: T[], indexes: K[]): Map<string | undefined, T[]>[] => {
	// create a map for each index
	const mapsArr: Map<string | undefined, T[]>[] = [];
	// add Map objects to the mapsArr
	for (const i in indexes) {
		mapsArr[i] = new Map<string | undefined, T[]>();
	}
	// loop through the array
	for (const entry of array) {
		// for each index, add to the map at the correct index
		for (const i in indexes) {
			// get the index to use
			const index: K = indexes[i];
			// get the current map to add to
			const currMap: Map<string | undefined, T[]> = mapsArr[i];
			// get the value at that index in the current entry
			const indexValue: string = convertAnyToString(entry[index]);
			// check if need to push or create array
			if (!currMap.has(indexValue)) {
				currMap.set(indexValue, [entry]);
			} else {
				(currMap.get(indexValue) || []).push(entry);
			}
		}
	}
	return mapsArr;
};

interface Comment {
	postId: number;
	id: number;
	name: string;
	email: string;
	body: string;
}

interface Album {
	userId: number;
	id: number;
	title: string;
}

interface Photo {
	albumId: number;
	id: number;
	title: string;
	url: string;
	thumbnailUrl: string;
}


// API documentation: https://jsonplaceholder.typicode.com/

getComments((comments: Array<Comment>)=> getPhotos(comments));

function getComments(callback: (comments: Array<Comment>, )=>void) {
	https.get('https://jsonplaceholder.typicode.com/posts/1/comments', (response) => {
		var statusCode = response.statusCode ?? 200;
		var rawData = '';
	
		if (statusCode >= 200 && statusCode <= 299) {
			throw new Error("Status code failed");
		}
	
		response.on('data', (chunk) => {
			rawData += chunk;
		});
	
		response.on('end', () => {
			try {
				// TODO:
				const comments: Array<Comment> = JSON.parse(rawData);
				// handle code here
				callback(comments);
	
	
			} catch (e) {
				console.error('This function is a failure');
			}
		});
	});
}

function getPhotos(comments: Array<Comment>) {
	https.get('https://jsonplaceholder.typicode.com/albums/1/photos', (response) => {
		const statusCode = response.statusCode ?? 200;
		let rawData = '';

		if (statusCode >= 200 && statusCode <= 299) {
			throw new Error("Status code failed");
		}

		response.on('data', (chunk) => {
			rawData += chunk;
		});

		response.on('end', () => {
			try {
				const photos: Array<Photo> = JSON.parse(rawData);
				// handle code here

				getAlbums(comments,photos);

			} catch (e) {
				console.error('This function is a failure');
			}
		});
	});
}

function getAlbums(comments: Array<Comment>, photos: Array<Photo>) {
	https.get('https://jsonplaceholder.typicode.com/users/1/albums', (response) => {
		const statusCode = response.statusCode ?? 200;
		let rawData = '';

		if (statusCode >= 200 && statusCode <= 299) {
			throw new Error("Status code failed");
		}

		response.on('data', (chunk) => {
			rawData += chunk;
		});

		response.on('end', () => {
			try {
				const albums: Array<Album> = JSON.parse(rawData);
				// handle code here

				console.log(comments, photos, albums);

				if (comments[0].id === 1) {
					console.log(comments[0].name);
				}

				// combine data

			} catch (e) {
				console.error('This function is a failure');
			}
		});
	});
}