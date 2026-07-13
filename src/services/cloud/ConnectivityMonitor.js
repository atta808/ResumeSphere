import * as Network from 'expo-network';

class ConnectivityMonitor {
  async isConnected() {
    const networkState = await Network.getNetworkStateAsync();
    return networkState.isConnected && networkState.isInternetReachable;
  }
}

export default new ConnectivityMonitor();
