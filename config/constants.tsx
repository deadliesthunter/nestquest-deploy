import { Platform } from "react-native";

export const WS_URL = (() => {
  if (__DEV__) {
    if (Platform.OS === "android") {
      return "ws://10.0.2.2:8000/ws/socket-server/";
    }
    return "ws://localhost:8000/ws/socket-server/";
  }
  return "wss://your-production-domain.com/ws/socket-server/";
})();
