import { db } from './src/firebase.js';
import { collection, getDocs, query, where } from 'firebase/firestore';

const findComplaint = async () => {
    try {
        console.log('Searching for description = "dfghjkl;\'"...');
        const q = query(collection(db, 'complaints'), where('description', '==', "dfghjkl;'"));
        const snapshot = await getDocs(q);
        
        console.log(`Found ${snapshot.size} matching documents.`);
        snapshot.docs.forEach((doc) => {
            const data = doc.data();
            console.log(`\n--- Document ID: ${doc.id} ---`);
            console.log('Reporter Name:', data.reporterName);
            console.log('Description:', data.description);
            console.log('hasImage:', data.hasImage);
            console.log('imageUrl type:', typeof data.imageUrl);
            if (data.imageUrl) {
                console.log('imageUrl length:', data.imageUrl.length);
                console.log('imageUrl start:', data.imageUrl.substring(0, 80));
            } else {
                console.log('imageUrl is empty/null');
            }
            console.log('Available keys:', Object.keys(data));
        });
        process.exit(0);
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};

findComplaint();
