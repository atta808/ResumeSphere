export class BaseAuthProvider {
  async signInWithEmail(email, password) {
    throw new Error('signInWithEmail not implemented');
  }

  async signInWithGoogle() {
    throw new Error('signInWithGoogle not implemented');
  }

  async signInAsGuest() {
    throw new Error('signInAsGuest not implemented');
  }

  async signOut() {
    throw new Error('signOut not implemented');
  }
}
