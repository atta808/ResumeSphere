import { BaseCloudProvider } from './BaseCloudProvider';
import { ref, uploadString, getDownloadURL } from 'firebase/storage';
import { doc, setDoc, deleteDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { storage, firestore } from '../../config/firebase';

export class FirebaseCloudProvider extends BaseCloudProvider {
  async uploadData(path, data) {
    try {
      const storageRef = ref(storage, path);
      // Data is typically JSON string
      await uploadString(storageRef, data);
      const url = await getDownloadURL(storageRef);
      return { success: true, url, path };
    } catch (error) {
      throw new Error(`Firebase Storage Upload Failed: ${error.message}`);
    }
  }

  async downloadData(path) {
    try {
      // In production, we might need a REST fetch to download the JSON
      // if using storage, or getDoc for Firestore.
      // This implementation gets the download URL.
      const storageRef = ref(storage, path);
      const url = await getDownloadURL(storageRef);
      const response = await fetch(url);
      const data = await response.json();

      return { success: true, data };
    } catch (error) {
      throw new Error(`Firebase Storage Download Failed: ${error.message}`);
    }
  }

  async syncEntity(entityType, entityId, payload, operation = 'UPDATE') {
    try {
      const docRef = doc(firestore, entityType, entityId);
      if (operation === 'DELETE') {
        await deleteDoc(docRef);
      } else {
        await setDoc(docRef, payload, { merge: true });
      }
      return { success: true, cloudId: entityId };
    } catch (error) {
      throw new Error(`Firebase Firestore Sync Failed: ${error.message}`);
    }
  }

  async pullChanges(entityType, lastSyncTime) {
    try {
      const collectionRef = collection(firestore, entityType);
      let q = collectionRef;
      if (lastSyncTime) {
        q = query(collectionRef, where('updatedAt', '>', lastSyncTime));
      }

      const querySnapshot = await getDocs(q);
      const changes = [];
      querySnapshot.forEach((doc) => {
        changes.push({ id: doc.id, ...doc.data() });
      });
      return changes;
    } catch (error) {
      throw new Error(`Firebase Pull Changes Failed: ${error.message}`);
    }
  }

  async publishPortfolio(portfolioId, htmlContent) {
    try {
      const path = `portfolios/${portfolioId}/index.html`;
      const storageRef = ref(storage, path);
      // Upload raw HTML
      await uploadString(storageRef, htmlContent, 'raw', { contentType: 'text/html' });
      const publicUrl = await getDownloadURL(storageRef);

      return {
        success: true,
        url: publicUrl
      };
    } catch (error) {
      throw new Error(`Firebase Portfolio Publish Failed: ${error.message}`);
    }
  }
}
