import { db } from './src/firebase.js';
import { collection, getDocs, setDoc, deleteDoc, doc } from 'firebase/firestore';

const migrateCollections = async () => {
    try {
        console.log('Starting migration...');

        // 1. Delete all documents in the current 'app_complaints'
        const appComplaintsSnapshot = await getDocs(collection(db, 'app_complaints'));
        console.log(`Found ${appComplaintsSnapshot.size} documents in 'app_complaints' to delete.`);
        for (const document of appComplaintsSnapshot.docs) {
            await deleteDoc(doc(db, 'app_complaints', document.id));
        }
        console.log("Deleted old 'app_complaints'.");

        // 2. Fetch all documents from 'complaints'
        const oldComplaintsSnapshot = await getDocs(collection(db, 'complaints'));
        console.log(`Found ${oldComplaintsSnapshot.size} documents in 'complaints' to migrate.`);

        // 3. Move them to 'app_complaints'
        for (const document of oldComplaintsSnapshot.docs) {
            // Keep the exact same ID
            await setDoc(doc(db, 'app_complaints', document.id), document.data());
            // Delete from old collection
            await deleteDoc(doc(db, 'complaints', document.id));
        }
        
        console.log("Migration complete! 'complaints' moved to 'app_complaints'.");
        process.exit(0);
    } catch (error) {
        console.error("Migration failed:", error);
        process.exit(1);
    }
};

migrateCollections();
