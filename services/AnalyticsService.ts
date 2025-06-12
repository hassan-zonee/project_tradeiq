import { getFirestore, doc, increment, setDoc } from 'firebase/firestore';
import { app } from '@/lib/firebaseConfig';

const db = getFirestore(app);

export const incrementSubscriptionClick = async (planType: 'basic' | 'pro' | 'premium') => {
  try {
    // Get the document reference for the specific plan
    const planRef = doc(db, 'subscription-clicks', planType);
    
    // Set or update the document with merge option
    await setDoc(planRef, {
      count: increment(1)
    }, { merge: true }); // merge: true will create the doc if it doesn't exist
    
    console.log(`Successfully incremented click count for ${planType} plan`);
  } catch (error) {
    console.error('Error incrementing subscription click:', error);
  }
}; 