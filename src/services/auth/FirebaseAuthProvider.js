import { BaseAuthProvider } from './BaseAuthProvider';
import { signInWithEmailAndPassword, signInAnonymously, GoogleAuthProvider, signInWithCredential, signOut as firebaseSignOut, signInWithCustomToken } from 'firebase/auth';
import { auth } from '../../config/firebase';

export class FirebaseAuthProvider extends BaseAuthProvider {
  async restoreAuthState(customToken) {
    if (customToken) {
      try {
        await signInWithCustomToken(auth, customToken);
      } catch (err) {
        console.warn('Firebase Custom Token sign in failed, relying on SDK persistence:', err);
      }
    }
  }

  async signInWithEmail(email, password) {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const idToken = await userCredential.user.getIdToken();
    return {
      accessToken: idToken,
      refreshToken: userCredential.user.refreshToken,
      user: {
        id: userCredential.user.uid,
        email: userCredential.user.email,
        isGuest: false,
      }
    };
  }

  async signInWithGoogle(idToken) {
    // In a real app, this receives the ID token from Google Auth Session
    if (!idToken) throw new Error('Google ID token is required');
    const credential = GoogleAuthProvider.credential(idToken);
    const userCredential = await signInWithCredential(auth, credential);
    const accessToken = await userCredential.user.getIdToken();

    return {
      accessToken,
      refreshToken: userCredential.user.refreshToken,
      user: {
        id: userCredential.user.uid,
        email: userCredential.user.email,
        isGuest: false,
      }
    };
  }

  async signInAsGuest() {
    const userCredential = await signInAnonymously(auth);
    const accessToken = await userCredential.user.getIdToken();

    return {
      accessToken,
      refreshToken: userCredential.user.refreshToken,
      user: {
        id: userCredential.user.uid,
        email: null,
        isGuest: true,
      }
    };
  }

  async signOut() {
    await firebaseSignOut(auth);
    return true;
  }
}
