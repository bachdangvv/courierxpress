import Echo from "laravel-echo";
import Pusher from "pusher-js";
import { useEffect, useRef } from "react";
import { useAuth } from "./auth";
import api from "./api";
import axios from "axios";

export function useEcho() {
  const { user } = useAuth();
  const echoRef = useRef(null);
  const ROOT = api.defaults.baseURL.replace(/\/api$/, "");
  const authClient = axios.create({ baseURL: ROOT });

  authClient.interceptors.request.use((cfg) => {
    const bearer =
      api.defaults.headers.common.Authorization ||
      localStorage.getItem("auth_token");
    if (bearer) cfg.headers.Authorization = bearer;
    cfg.headers.Accept = "application/json";
    cfg.headers["Content-Type"] = "application/json";
    return cfg;
  });

  useEffect(() => {
    if (!user) return;

    window.Pusher = Pusher;
    const key = import.meta.env.VITE_PUSHER_APP_KEY;
    const cluster = import.meta.env.VITE_PUSHER_APP_CLUSTER || "ap1";

    const echo = new Echo({
      broadcaster: "pusher",
      key,
      cluster,
      forceTLS: true,
      enabledTransports: ["wss"], // secure websocket only
      authorizer: (channel) => ({
        authorize: (socketId, callback) => {
          authClient
            .post("/broadcasting/auth", {
              socket_id: socketId,
              channel_name: channel.name,
            })
            .then((res) => callback(false, res.data))
            .catch((err) => {
              console.error(
                "Broadcast auth failed:",
                err?.response?.data || err
              );
              callback(true, err);
            });
        },
      }),
    });

    window.Echo = echo;
    echoRef.current = echo;

    return () => {
      echo.disconnect();
      echoRef.current = null;
    };
  }, [user]);

  return echoRef.current;
}
