import { initializeApp } from 'firebase/app';
import { getDatabase, ref } from 'firebase/database';

export { child, get } from 'firebase/database';

export const firebaseApp = initializeApp({ databaseURL: 'https://hacker-news.firebaseio.com' });
export const firebaseDbRef = ref(getDatabase(firebaseApp), 'v0');
