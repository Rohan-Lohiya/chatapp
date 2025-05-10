"use client";
import socket from "../socket";
import { useState, useEffect } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import {
  setChatData,
  setmygoogleID,
  setmyname,
  setmyprofileimage,
  addMessage,
  pushonline,
  setonline,
  removeonline,
} from "@/app/store/selectedUserSlice";

export function useSocketAndChatData(session) {
  const [isLoading, setIsLoading] = useState(true);
  const [chatData, setchatData] = useState(null);
  const [error, setError] = useState(null);
  const [hasFetched, setHasFetched] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    // Only run this logic when session is available
    if (!session?.user?.email || hasFetched) return;

    if (!socket.connected) {
      socket.connect();
    }

    const fetchAndMaybeRegister = async () => {
      try {
        setIsLoading(true);
        const googleID = session.user.email;

        const response = await axios.post(
          "http://localhost:5000/api/get-chat-data",
          { googleID },
          { headers: { "Content-Type": "application/json" } }
        );

        if (response.data?.chatData) {
          console.log("✅ Chat data fetched:", response.data.chatData);
          setchatData(response.data.chatData);
          setHasFetched(true);
          dispatch(setChatData(response.data.chatData)); // Dispatch the chat data to Redux store
          dispatch(setmygoogleID(response.data.chatData.myGoogleID));
          dispatch(setmyname(response.data.chatData.name));
          dispatch(setmyprofileimage(response.data.chatData.imageURL));
          dispatch(setonline(response.data.chatData.onlineUsers));
        }
      } catch (err) {
        console.error("⚠️ Error fetching chat data:", err);
        setError(err.response?.data?.error || "Failed to fetch chat data");

        if (err.response?.status === 404) {
          console.log("🆕 Registering user:", session.user.email);
          socket.emit("register-user", {
            googleIdOrEmail: session.user.email,
            imageURL: session.user.image,
            name: session.user.name,
          });
        }
      } finally {
        setIsLoading(false);
      }
    };

    const onConnect = () => {
      console.log("🔌 Socket connected:", socket.id);
      // Re-register user whenever socket connects
      if (session?.user?.email) {
        socket.emit("register-user", {
          googleIdOrEmail: session.user.email,
          imageURL: session.user.image,
          name: session.user.name,
        });
      }
    };

    const onReceiveMessage = (data) => {
      console.log("📥 Message received:", data);
      dispatch(
        addMessage({
          from: data.from,
          to: data.to,
          text: data.text,
          timestamp: data.timestamp,
          read: data.read,
          delivered: data.delivered,
        })
      );
    };

    const onRegistrationComplete = () => {
      console.log("✅ Registration complete, fetching chat data again...");
      fetchAndMaybeRegister();
    };

    socket.on("connect", onConnect);
    socket.on("receive-message", onReceiveMessage);
    socket.on("registration-complete", onRegistrationComplete);
    socket.on("user-online", (data) => {
      console.log("🟢 User online:", data);
      //dispatch(pushonline(data));
    });
    socket.on("user-offline", (data) => {
      console.log("🔴 User offline:", data);
      dispatch(removeonline(data));
    });

    // Run fetch logic only when session is fully available
    fetchAndMaybeRegister();

    return () => {
      socket.off("connect", onConnect);
      socket.off("receive-message", onReceiveMessage);
      socket.off("registration-complete", onRegistrationComplete);
      socket.off("user-online");
      socket.off("user-offline");
    };
  }, [session, hasFetched]);

  return { chatData, isLoading, error };
}
