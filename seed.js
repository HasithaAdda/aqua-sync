/* global process */
import { db } from './src/firebase.js';
import { collection, addDoc, serverTimestamp, GeoPoint } from 'firebase/firestore';

const seedData = async () => {
    try {
        console.log('Seeding complaints into separate collections...');

        // 1. Web Report -> goes into 'web_complaints'
        const webReport = {
            isAnonymous: false,
            phone: '123-456-7890',
            vesselType: 'Large Net Fishing Boat (Trawler)',
            activityType: 'Fishing in Banned Area (CRZ / Protected Zone)',
            description: 'Observed a large trawler operating dangerously close to the shore, well within the CRZ limits. They were using fine mesh nets. I am reporting this via the Aqua Sync Web Portal.',
            locationName: 'Miramar Beach, Goa',
            lat: 15.4856,
            lng: 73.8080,
            location: new GeoPoint(15.4856, 73.8080),
            status: 'Pending',
            timestamp: serverTimestamp(),
            reporterName: 'Web User',
            hasImage: false,
            aiAnalysis: {
                priority: 'High',
                category: 'CRZ Violation',
                isHotspot: true,
                summary: 'Trawler operating in banned coastal zone using illegal equipment.'
            },
            source: 'Web Application'
        };

        // 2. App Report -> goes into 'app_complaints'
        const appReport = {
            isAnonymous: true,
            phone: '098-765-4321',
            vesselType: 'Speedboat / Motorboat',
            activityType: 'Dumping Trash or Oil',
            description: 'Saw a speedboat dumping what looked like oily waste into the estuary. Reporting securely from the Aqua Sync Mobile App.',
            locationName: 'Zuari River, Goa',
            lat: 15.3934,
            lng: 73.8781,
            location: new GeoPoint(15.3934, 73.8781),
            status: 'Investigating',
            timestamp: serverTimestamp(),
            reporterName: 'App User (Anonymous)',
            hasImage: false,
            aiAnalysis: {
                priority: 'High',
                category: 'Environmental Hazard',
                isHotspot: false,
                summary: 'Speedboat illegally discharging oil/waste into the river.'
            },
            source: 'Mobile App'
        };

        const docRef1 = await addDoc(collection(db, 'web_complaints'), webReport);
        console.log('Added Web Report to "web_complaints" with ID: ', docRef1.id);

        const docRef2 = await addDoc(collection(db, 'app_complaints'), appReport);
        console.log('Added App Report to "app_complaints" with ID: ', docRef2.id);

        console.log('Seeding complete! You can press Ctrl+C to exit if it hangs.');
        process.exit(0);
    } catch (error) {
        console.error('Error seeding data: ', error);
        process.exit(1);
    }
};

seedData();
