/* global process */
import { db } from './src/firebase.js';
import { collection, getDocs, limit, query, orderBy } from 'firebase/firestore';

const readComplaints = async () => {
    try {
        console.log('Fetching latest 5 complaints from Firestore...');
        const q = query(collection(db, 'complaints'), orderBy('timestamp', 'desc'), limit(5));
        const snapshot = await getDocs(q);
        
        console.log(`Found ${snapshot.size} documents.`);
        snapshot.docs.forEach((doc, idx) => {
            const data = doc.data();
            console.log(`\n--- Document ${idx + 1} (ID: ${doc.id}) ---`);
            console.log('Reporter Name:', data.reporterName);
            console.log('Activity Type:', data.activityType);
            console.log('Timestamp:', data.timestamp ? (data.timestamp.toDate ? data.timestamp.toDate().toISOString() : data.timestamp) : 'N/A');
            console.log('hasImage:', data.hasImage);
            console.log('imageUrl (type):', typeof data.imageUrl);
            if (data.imageUrl) {
                console.log('imageUrl preview:', data.imageUrl.substring(0, 150) + '...');
            } else {
                console.log('imageUrl is empty/null');
            }
            // Log all keys
            console.log('Available keys:', Object.keys(data));
        });
        process.exit(0);
    } catch (error) {
        console.error('Error reading complaints:', error);
        process.exit(1);
    }
};

readComplaints();
