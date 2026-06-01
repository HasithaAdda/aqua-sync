/* global process, Buffer */
import { db } from './src/firebase.js';
import { collection, getDocs, query, orderBy, limit } from 'firebase/firestore';
import fs from 'fs';

const testDecode = async () => {
    try {
        const q = query(collection(db, 'complaints'), orderBy('timestamp', 'desc'), limit(5));
        const snapshot = await getDocs(q);
        
        for (const doc of snapshot.docs) {
            const data = doc.data();
            if (data.imageUrl) {
                console.log(`Processing doc ${doc.id}...`);
                const url = data.imageUrl;
                let cleanBase64 = url;
                if (url.startsWith('data:image')) {
                    cleanBase64 = url.split(',').last || url.split(',')[1] || url;
                }
                cleanBase64 = cleanBase64.replace(/\s/g, '');
                
                try {
                    const buffer = Buffer.from(cleanBase64, 'base64');
                    const filename = `test_image_${doc.id}.png`;
                    fs.writeFileSync(filename, buffer);
                    console.log(`Saved image to ${filename}, size: ${buffer.length} bytes`);
                } catch (err) {
                    console.error(`Failed to write image for ${doc.id}:`, err);
                }
            }
        }
        process.exit(0);
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};

testDecode();
