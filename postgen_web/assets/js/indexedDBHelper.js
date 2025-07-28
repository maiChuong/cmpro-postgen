const EditorDB = (function() {
    const DB_NAME = 'editorDB';
    const STORE_NAME = 'contentStore';
    const DB_VERSION = 1;

    let db;

    function getDB() {
        return new Promise((resolve, reject) => {
            if (db) {
                return resolve(db);
            }

            const request = indexedDB.open(DB_NAME, DB_VERSION);

            request.onerror = (event) => {
                console.error('IndexedDB error:', event.target.error);
                reject('Error opening IndexedDB.');
            };

            request.onsuccess = (event) => {
                db = event.target.result;
                resolve(db);
            };

            request.onupgradeneeded = (event) => {
                const db = event.target.result;
                if (!db.objectStoreNames.contains(STORE_NAME)) {
                    db.createObjectStore(STORE_NAME, { keyPath: 'id' });
                }
            };
        });
    }

    async function setContent(id, content) {
        const db = await getDB();
        return new Promise((resolve, reject) => {
            const transaction = db.transaction([STORE_NAME], 'readwrite');
            const store = transaction.objectStore(STORE_NAME);
            const request = store.put({ id, content, timestamp: new Date() });

            request.onsuccess = () => resolve();
            request.onerror = (event) => {
                console.error('Error saving content to IndexedDB:', event.target.error);
                reject('Could not save content.');
            };
        });
    }

    async function getContent(id) {
        const db = await getDB();
        return new Promise((resolve, reject) => {
            const transaction = db.transaction([STORE_NAME], 'readonly');
            const store = transaction.objectStore(STORE_NAME);
            const request = store.get(id);

            request.onsuccess = () => resolve(request.result ? request.result.content : null);
            request.onerror = (event) => {
                console.error('Error getting content from IndexedDB:', event.target.error);
                reject('Could not retrieve content.');
            };
        });
    }

    async function deleteContent(id) {
        const db = await getDB();
        const transaction = db.transaction([STORE_NAME], 'readwrite');
        transaction.objectStore(STORE_NAME).delete(id);
    }

    return {
        setContent,
        getContent,
        deleteContent
    };
})();