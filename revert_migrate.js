/* global process */
import { db } from './src/firebase.js';
import { collection, getDocs, setDoc, deleteDoc, doc } from 'firebase/firestore';

const revertMigration = async () => {
    try {
        console.log('Reverting migration... Moving app_complaints back to complaints.');

        // 1. Fetch all documents from 'app_complaints'
        const appComplaintsSnapshot = await getDocs(collection(db, 'app_complaints'));
        console.log(`Found ${appComplaintsSnapshot.size} documents in 'app_complaints' to revert.`);

        // 2. Move them to 'complaints'
        for (const document of appComplaintsSnapshot.docs) {
            // Keep the exact same ID
            await setDoc(doc(db, 'complaints', document.id), document.data());
            // Delete from old collection
            await deleteDoc(doc(db, 'app_complaints', document.id));
        }
        
        console.log("Revert complete! 'app_complaints' moved back to 'complaints'.");
        process.exit(0);
    } catch (error) {
        console.error("Revert failed:", error);
        process.exit(1);
    }
};

revertMigration();
