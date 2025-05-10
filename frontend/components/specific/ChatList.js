"use client";
import React, { useState } from "react";
import styles from "./chatlist.module.css";
import Image from "next/image";
import { useDispatch, useSelector } from "react-redux";
import { setSelectedGoogleID } from "@/app/store/selectedUserSlice";
import { useEffect } from "react";

const ChatList = ({ totalpeople = [{}], messages = [] }) => {
  const dispatch = useDispatch();
  const selectedGoogleID = useSelector((state) => state.selectedUser.googleID);

  useEffect(() => {
    if (selectedGoogleID) {
      console.log("Selected Google ID:", selectedGoogleID);
    }
  }, [selectedGoogleID]);

  const handleClick = (googleID) => {
    dispatch(setSelectedGoogleID(googleID));
  };

  const getUnreadCount = (googleID) => {
    return messages.filter(
      (msg) => msg.from === googleID && !msg.read
    ).length;
  };

  return (
    <div className={styles.chatContainer}>
      {totalpeople.map((friend, index) => {
        const unreadCount = getUnreadCount(friend.GoogleID);

        return (
          <div
            key={index}
            className={`${styles.chatItem} ${
              selectedGoogleID === friend.GoogleID ? styles.isselected : ""
            }`}
            onClick={() => handleClick(friend.GoogleID)}
          >
            <span className={styles.avatar}>
              <Image
                src={friend.image}
                height={40}
                width={40}
                alt={friend.name || "User avatar"}
              />
            </span>
            <span className={styles.chatInfo}>
              <div className={styles.friendName}>{friend.name}</div>
              <div className={styles.newMessages}>
                {unreadCount > 0
                  ? `${unreadCount} new message(s)`
                  : "No new messages"}
              </div>
            </span>
            <hr className={styles.linebreak}/>
          </div>
          
        );
      })}
    </div>
  );
};

export default ChatList;
