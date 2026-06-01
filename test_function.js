import { db } from './src/firebase.js';
import { doc, getDoc } from 'firebase/firestore';

const getReportImage = (report) => {
    if (!report) return null;
    const url = report.imageUrl || report.image || report.photoUrl || report.photo || report.evidenceImage || report.proofImageUrl;
    if (!url) return null;
    
    if (typeof url === 'string') {
        // Strip any potential whitespace/newlines from base64 strings
        if (url.startsWith('data:image')) {
            return url.replace(/\s/g, '');
        }
        if (!url.startsWith('http')) {
            const cleanBase64 = url.trim().replace(/\s/g, '');
            return `data:image/jpeg;base64,${cleanBase64}`;
        }
    }
    return url;
};

const testFunction = async () => {
    try {
        const docRef = doc(db, 'complaints', 'wkXBNoROT4smAhjr1tGT');
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            const data = docSnap.data();
            const result = getReportImage(data);
            console.log('getReportImage result type:', typeof result);
            if (result) {
                console.log('getReportImage result length:', result.length);
                console.log('getReportImage result start:', result.substring(0, 100));
            } else {
                console.log('getReportImage returned falsy/null!');
            }
        } else {
            console.log('Document not found!');
        }
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

testFunction();
