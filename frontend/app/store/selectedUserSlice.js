"use client";
import { createSlice } from "@reduxjs/toolkit";
import chatData from "@/components/specific/chatData";

const initialState = {
  mygoogleID: "",
  googleID: "",
  myname: "",
  about: "Time pass only",
  myprofileimage: "",
  totalPeople: chatData.friends,
  messages: chatData.messages,
  online: [], // fallback if online is not in chatData
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
      state.totalPeople = action.payload.friends;
      state.messages = action.payload.messages;
      state.online = action.payload.onlineUsers;
    },
    
    setaddpeople: (state, action) => {
      state.totalPeople.push(action.payload);
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
    pushonline: (state, action) => {
      const newUser = action.payload;
      if (!state.online.some(user => user.googleID === newUser.googleID)) {
        state.online.push(newUser);
      }
    },
    removeonline: (state, action) => {
      const googleIDToRemove = action.payload;
      state.online = state.online.filter(
        user => user.googleID !== googleIDToRemove
      );
    },
    setmygoogleID: (state, action) => {
      state.mygoogleID = action.payload;
    },
    setmyprofileimage: (state, action) => {
      state.myprofileimage = action.payload;
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
  setaddpeople,
  addMessage,
  markAsRead,
  setonline,
  setmygoogleID,
  clearchat,
  removefriend,
  setmyprofileimage,
  setmyname,
  setwebTheme,
  setabout,
  setenterissend,
  pushonline,
  removeonline,
} = selectedUserSlice.actions;

export default selectedUserSlice.reducer;
