"use client";
import React, { useEffect, useState } from "react";
import styles from "./selectedchats.module.css";
import { useSelector } from "react-redux";
import Image from "next/image";

const SelectedChats = ({ GoogleID, messages = [] }) => {
  const mygoogleID = useSelector((state => state.selectedUser.mygoogleID));
  const [allchats, setallchats] = useState([]);
  const messagesData = useSelector(
    (state) => state.selectedUser.messages || messages
  );

  useEffect(() => {
    if (GoogleID) {
      const filteredChats = messages
        .filter((msg) => msg.from === GoogleID || msg.to === GoogleID)
        .sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
      setallchats(filteredChats);
    }
  }, [GoogleID, messages]);

  let lastDate = "";

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString([], {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatTime = (dateStr) => {
    return new Date(dateStr).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  };

  const checkread = (timestamp) => {
    const msg = messagesData.find((m) => m.timestamp === timestamp);
    if (!msg) return 3; // Assume it's "sent" if not found
    if (!msg.delivered) return 3;
    if (msg.read) return 2;
    return 1;
  };
  

  return (
    <div className={styles.chatWrapper}>
      {allchats.map((chat, index) => {
        const isMe = chat.from === mygoogleID;
        const chatDate = formatDate(chat.timestamp);
        const showDate = chatDate !== lastDate;
        lastDate = chatDate;

        return (
          <React.Fragment key={index}>
            {showDate && <div className={styles.dateDivider}>{chatDate}</div>}
            <div className={isMe ? styles.chatRight : styles.chatLeft}>
              <div className={styles.individualchatcont}>
                <div className={styles.individualchattext}>{chat.text}</div>
                <div className={styles.individualchatdate}>
                  {formatTime(chat.timestamp)}
                </div>
                {chat.from == mygoogleID && <div className={styles.individualchatstatus}>
                  <Image
                    src={
                      checkread(chat.timestamp) === 1
                        ? "/delivered.png" // Image A
                        : checkread(chat.timestamp) === 2
                        ? "/read.png" // Image B
                        : "/sent.png" // Image C
                    }
                    height={20}
                    width={20}
                    alt="status"
                  />
                </div>}
              </div>
            </div>
          </React.Fragment>
        );
      })}
    </div>
  );
};

export default SelectedChats;

