import { db } from './src/firebase.js';
import { collection, getDocs } from 'firebase/firestore';

const checkImages = async () => {
    try {
        console.log('Querying all complaints...');
        const snapshot = await getDocs(collection(db, 'complaints'));
        console.log(`Total complaints: ${snapshot.size}`);
        snapshot.docs.forEach((doc) => {
            const data = doc.data();
            console.log(`Document ID: ${doc.id}`);
            console.log(`  activityType: ${data.activityType}`);
            console.log(`  imageUrl field exists: ${'imageUrl' in data}`);
            console.log(`  imageUrl type: ${typeof data.imageUrl}`);
            if (data.imageUrl) {
                console.log(`  imageUrl start: ${data.imageUrl.substring(0, 50)}`);
                console.log(`  imageUrl end: ${data.imageUrl.substring(data.imageUrl.length - 50)}`);
            }
            console.log(`  hasImage: ${data.hasImage}`);
        });
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

checkImages();
