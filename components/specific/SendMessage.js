"use client"
import React, { useState, useRef } from 'react'
import styles from './sendmessage.module.css'
import { useSelector, useDispatch } from 'react-redux'
import Image from 'next/image'
import { addMessage } from '@/app/store/selectedUserSlice'

const SendMessage = () => {
  const selectedGoogleID = useSelector((state) => state.selectedUser.googleID);
  const mygoogleID = useSelector((state) => state.selectedUser.mygoogleID);
  const enterissend = useSelector((state) => state.selectedUser.enterissend);
  const [message, setmessage] = useState("");
  const dispatch = useDispatch();
  // const bottomRef = useRef(); // Optional: for autoscroll

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      if (!e.shiftKey && enterissend) {
        e.preventDefault(); 
        handleSend();
      }
    }
  };

  const handleChange = (e) => {
    setmessage(e.target.value);
    e.target.style.height = "auto"; // Reset height
    e.target.style.height = e.target.scrollHeight + "px"; // Set to scroll height
  };

  const handleSend = () => {
    if (message.trim()) {
      console.log(`Sending message: "${message}" to ${selectedGoogleID}`);
      dispatch(addMessage({
        from: mygoogleID,
        to: selectedGoogleID,
        text: message,
        timestamp: new Date().toISOString(),
        read: false,
        delivered: false,
      }));
      setmessage("");

      // Optional: scroll to bottom
      // bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    } else {
      console.log("Message is empty!");
    }
  };

  return (
    <div className={styles.sendmessagecont}>
      <div className={styles.sendinputcont}>
        {/* Use textarea if you want multi-line input */}
        <textarea
          className={styles.sendmessageinput}
          value={message}
          onKeyDown={handleKeyDown}
          onChange={handleChange}
          placeholder="Type a Message"
          rows={1} // You can adjust or make dynamic
        />
      </div>
      <div className={styles.sendimagecont}>
        <Image onClick={handleSend} src={'/send.png'} height={40} width={40} alt='Send' />
      </div>
      {/* Optional scroll marker */}
      {/* <div ref={bottomRef}></div> */}
    </div>
  );
};

export default SendMessage;
