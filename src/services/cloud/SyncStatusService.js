class SyncStatusService {
  constructor() {
    this.status = 'IDLE'; // IDLE, SYNCING, OFFLINE, ERROR
    this.listeners = [];
  }

  setStatus(newStatus) {
    this.status = newStatus;
    this.notifyListeners();
  }

  getStatus() {
    return this.status;
  }

  subscribe(listener) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  notifyListeners() {
    this.listeners.forEach(listener => listener(this.status));
  }
}

export default new SyncStatusService();
