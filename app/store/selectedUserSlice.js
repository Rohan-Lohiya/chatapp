"use client";
import { createSlice } from "@reduxjs/toolkit";
import chatData from "@/components/specific/chatData";

const initialState = {
  mygoogleID: "rohan@gmail.com",
  googleID: "",
  myname: "Rohan",
  about: "Time pass only",
  totalPeople: chatData.totalpeople,
  messages: chatData.messages,
  online: chatData.online || [], // fallback if online is not in chatData
  webtheme: "light",
  enterissend: true,
};

const selectedUserSlice = createSlice({
  name: "selectedUser",
  initialState,
  reducers: {
    setSelectedGoogleID: (state, action) => {
      state.googleID = action.payload;
    },
    setChatData: (state, action) => {
      state.totalPeople = action.payload.totalPeople;
      state.messages = action.payload.messages;
    },
    addMessage: (state, action) => {
      state.messages.push(action.payload);
    },
    markAsRead: (state, action) => {
      const from = action.payload;
      state.messages = state.messages.map((msg) =>
        msg.from === from ? { ...msg, read: true } : msg
      );
    },
    setonline: (state, action) => {
      state.online = action.payload;
    },
    setmygoogleID: (state, action) => {
      state.mygoogleID = action.payload;
    },
    clearchat: (state, action) => {
      const googleIDToClear = action.payload;
      state.messages = state.messages.filter(
        msg =>
          !(
            (msg.from === googleIDToClear && msg.to === state.mygoogleID) ||
            (msg.to === googleIDToClear && msg.from === state.mygoogleID)
          )
      );
    },
    removefriend: (state, action) => {
      const googleIDToRemove = action.payload;
      state.totalPeople = state.totalPeople.filter(
        friend => friend.GoogleID !== googleIDToRemove
      );
      state.messages = state.messages.filter(
        msg =>
          !(
            (msg.from === googleIDToRemove && msg.to === state.mygoogleID) ||
            (msg.to === googleIDToRemove && msg.from === state.mygoogleID)
          )
      );
    },
    setmyname: (state, action) => {
      state.myname = action.payload;
    },
    setabout: (state, action) => {
      state.about = action.payload;
    },
    setwebTheme: (state, action) => {
      state.theme = action.payload;
    },
    setenterissend: (state, action) => {
      state.enterissend = action.payload;
    },
  },
});

export const {
  setSelectedGoogleID,
  setChatData,
  addMessage,
  markAsRead,
  setonline,
  setmygoogleID,
  clearchat,
  removefriend,
  setmyname,
  setwebTheme,
  setabout,
  setenterissend,
} = selectedUserSlice.actions;

export default selectedUserSlice.reducer;
