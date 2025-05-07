"use client"
import React from 'react'
import styles from './chat.module.css'
import Image from 'next/image'
import ChatList from '@/components/specific/ChatList'
import SelectedChats from '@/components/specific/SelectedChats'
import SendMessage from '@/components/specific/SendMessage'
import Settings from '@/components/specific/Settings'
import Profile from '@/components/specific/Profile'
import { useSelector } from 'react-redux'
import { useDispatch } from 'react-redux'
import { useEffect, useState } from 'react'
import { useRef } from 'react'
import { clearchat, removefriend, setSelectedGoogleID } from '../store/selectedUserSlice'


const page = () => {
  const selectedGoogleID = useSelector((state) => state.selectedUser.googleID);
  const isonline = useSelector((state) => state.selectedUser.online);
  const totalPeople = useSelector((state) => state.selectedUser.totalPeople);
  const messages = useSelector((state) => state.selectedUser.messages);
  const [isselectedGID, setisselectedGID] = useState(false);
  const [menuVisible, setMenuVisible] = useState(false);
  const [clearchatpressed, setclearchatpressed] = useState(false);
  const [deletechatpressed, setdeletechatpressed] = useState(false);
  const [firstdivselected, setfirstdivselected] = useState("1");
  const menuRef = useRef(null);
  const imageRef = useRef(null);
  const clearchatref = useRef(null);
  const deletechatref = useRef(null);
  const dispatch = useDispatch();

  const selectedName = (GoogleID) => {
    const friend = totalPeople.find((friend) => friend.GoogleID === GoogleID);
    return friend ? friend.Name : 'Unknown'; // Return 'Unknown' if no match is found
  };
  const checkonline = (GoogleID) => {
    return isonline.some((friend) => friend.GoogleID === GoogleID);
    
  };
  useEffect(() => {
    setisselectedGID(!!selectedGoogleID);

  }, [selectedGoogleID])

  useEffect(() => {
    const handleClickOutside = (event) => {
      const isClickOutsideMenu = !menuRef.current || !menuRef.current.contains(event.target);
      const isClickOutsideImage = !imageRef.current || !imageRef.current.contains(event.target);
      const isClickOutsideClearChat = !clearchatref.current || !clearchatref.current.contains(event.target);
      const isClickOutsideDeleteChat = !deletechatref.current || !deletechatref.current.contains(event.target);
  
      if (isClickOutsideMenu && isClickOutsideImage && isClickOutsideClearChat && isClickOutsideDeleteChat) {
        setMenuVisible(false);
        setclearchatpressed(false);
        setdeletechatpressed(false);
      }
    };
  
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
  
  
  const handlemoreheadingoption = () => {
    console.log("More options clicked for Google ID:", selectedGoogleID);
    setMenuVisible(prev => !prev);
  }
  const handleclosechat = () => {
    console.log("Close chat clicked for Google ID:", selectedGoogleID);
    setisselectedGID(false);
  }
  const handleclearchat = () => {
    console.log("Clear chat clicked for Google ID:", selectedGoogleID);
    dispatch(clearchat(selectedGoogleID));
    setclearchatpressed(false);
  }
  const handledeletechat = () => {
    console.log("Delete chat clicked for Google ID:", selectedGoogleID);
    dispatch(removefriend(selectedGoogleID));
    setSelectedGoogleID(null);
    setisselectedGID(false);
    setdeletechatpressed(false);
  }
  const handlesetfirstdivselected = (value) => {
    setfirstdivselected(value);
    value !== '1' && setisselectedGID(false);

  }

  

  return (
    <>
    {clearchatpressed && <div className={styles.whitescreen}>
    <div ref={clearchatref} className={`${styles.confirmclearcont} ${clearchatpressed ? styles.confirmclearcontVisible : ''}`}> 
        <h2>Clear this chat?</h2><h5>Chat will be empty but will be remain in list</h5>
        <div className={styles.flexcenterspacearound}><div onClick={() => {setclearchatpressed(false)}} className={styles.clearchatoptioncancel}>Cancel</div>
        <div onClick={handleclearchat} className={styles.clearchatoptionclear}>Clear chat</div></div>
        </div>
      </div>}
    {deletechatpressed && <div className={styles.whitescreen}>
    <div ref={deletechatref} className={`${styles.confirmclearcont} ${deletechatpressed ? styles.confirmclearcontVisible : ''}`}> 
        <h2>Delete this chat?</h2><h5>Chat and data will be removed</h5>
        <div className={styles.flexcenterspacearound}><div onClick={() => {setdeletechatpressed(false)}} className={styles.clearchatoptioncancel}>Cancel</div>
        <div onClick={handledeletechat} className={styles.clearchatoptionclear}>Delete chat</div></div>
        </div>
      </div>} 
    <div className={styles.container}>
      <div className={styles.first}>
      
    <div
      onClick={() => handlesetfirstdivselected('1')}
      className={`${styles.iconWrapper} ${firstdivselected === '1' ? styles.selected : ''}`}
    >
      <Image
        className={styles.chatselect}
        src={firstdivselected === '1' ? '/chatselect.png' : '/chatnotselect.png'}
        width={40}
        height={40}
        alt='chat'
      />
    </div>

    <div
      onClick={() => handlesetfirstdivselected('2')}
      className={`${styles.iconWrapper} ${firstdivselected === '2' ? styles.selected : ''}`}
    >
      <Image
        className={styles.settingselect}
        src={firstdivselected === '2' ? '/settingselected.png' : '/settingsnotselected.png'}
        width={40}
        height={40}
        alt='setting'
      />
    </div>

    <div
      onClick={() => handlesetfirstdivselected('3')}
      className={`${styles.iconWrapper} ${firstdivselected === '3' ? styles.selected : ''} ${styles.avtarselectcont}`}
    >
      <Image
        className={styles.avtarselect}
        src={'/google.png'}
        width={40}
        height={40}
        alt='avtar'
      />
    </div>

  

      </div><hr className={styles.break}/>
      <div className={styles.second}>
        <div className={styles.secondheading}>
          <span>{firstdivselected === '1' ? "Chats" : (firstdivselected === '2' ? "Settings" : "Profile")}</span>
          {firstdivselected === '1' && <span className={styles.imagecont}>
            <span><Image className={styles.optImage} src={'/addchat.png'} width={25} height={25} alt='AddChat'></Image></span>
            <span><Image className={styles.optImage} src={'/group.png'}  width={40} height={40} alt='Group'></Image></span>
          </span>}
        </div>
        {firstdivselected === '1' && <><div className={styles.searchCont}><input type="text" placeholder='Search' /></div>
        <div className={styles.chatlistcont}><ChatList totalpeople={totalPeople} messages={messages}/></div></>}
        {firstdivselected === '2' && <div className={styles.settingspagecont}><Settings/></div>}
        {firstdivselected === '3' && <div className={styles.profilepagecont}><Profile/></div>}
      </div>
      <hr className={styles.break} />
      <div className={styles.third}>
        {!isselectedGID && <div className={styles.flexcentercenter}><h1>Welcome</h1><div>Select chat to start</div></div>}
        {isselectedGID && <>
           <div className={styles.thirdheading}>
             <span className={styles.selectedchatinfocont}>
               <Image className={styles.selectedavtarimage} src={'/chad.jpeg'} width={40} height={40} alt='Group'></Image>
               <span className={styles.selectedavtarinfo}>
                 <span className={styles.selectedavtarname}>{selectedName(selectedGoogleID)}</span>
                 <span className={styles.isofflinespan}>{checkonline(selectedGoogleID) ? "Online" : "Offline"}</span>
               </span>
            
             </span>
             <span className={styles.dropdownWrapper}>
              <Image ref={imageRef} onClick={handlemoreheadingoption} className={styles.moreoptimage} src={'/more.png'} width={40} height={40} alt='MoreOption'></Image>
                   {menuVisible && (
                   <div ref={menuRef} className={styles.moreoptioncont}>
                    <div onClick={handleclosechat} className={styles.moreoptionsinnercont}>
                      <div className={styles.moreoptions}>Close Chat</div>
                    </div>
                    <div onClick={() => {setclearchatpressed(true); setMenuVisible(false)}} className={styles.moreoptionsinnercont}>
                      <div className={styles.moreoptions}>Clear Chat</div>
                      </div>
                    <div onClick={() => {setdeletechatpressed(true); setMenuVisible(false)}} className={styles.moreoptionsinnercont}>
                      <div className={styles.moreoptions}>Delete Chat</div>
                    </div>
                  </div>
                  )}
             </span>
           </div>
           <div className={styles.selectedchatcont}><SelectedChats GoogleID = {selectedGoogleID} messages = {messages}/></div>
           <div className={styles.sendmessagecont}><SendMessage/></div>
        </>}
      </div>
    </div></>
  )
}

export default page
