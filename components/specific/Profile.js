import React from "react";
import styles from "./profile.module.css";
import Image from "next/image";
import { useSelector, useDispatch } from "react-redux";
import { useState, useRef } from "react";
import { setmyname, setabout } from "@/app/store/selectedUserSlice";

const Profile = () => {
  const profilename = useSelector((state) => state.selectedUser.myname);
  const profileabout = useSelector((state) => state.selectedUser.about);
  const [name, setname] = useState(profilename);
  const [allowedit, setallowedit] = useState(false);
  const [aboutinfo, setaboutinfo] = useState(profileabout);
  const [alloweditabout, setalloweditabout] = useState(false);
  const dispatch = useDispatch();
  const inputRef = useRef(null);
  const inputRefabout = useRef(null);

  const handlechangeS = (e) => {
    setname(e.target.value);
    dispatch(setmyname(e.target.value));
  };
  const handleaboutchangeS = (e) => {
    setaboutinfo(e.target.value);
    dispatch(setabout(e.target.value));
  }

  const handleEditClick = () => {
    setallowedit(!allowedit);
    setTimeout(() => {
      inputRef.current?.focus();
    }, 0); // Ensure focus after state update
  };
  const handleAboutEditClick = () => {
    setalloweditabout(!alloweditabout);
    setTimeout(() => {
      inputRefabout.current?.focus();
    }, 0); // Ensure focus after state update
  }

  return (
    <div className={styles.profilecont}>
      <div className={styles.profilepiccont}>
        <div className={styles.profilepicinnercont}>
          <Image
            className={styles.profilepicimg}
            src={"/chad.jpeg"}
            height={100}
            width={100}
            alt="profilepic"
          ></Image>

          <div className={styles.profilepiceditbtn}>
            <Image
              src={"/camera.png"}
              height={30}
              width={30}
              alt="rofilepic"
            ></Image>
          </div>
        </div>
      </div>
      <div className={styles.editname}>
        <div className={styles.editnameheadiing}>Your Name</div>
        <div className={styles.editnamecont}>
          <input
            ref={inputRef}
            className={styles.editnameinput}
            type="text"
            onChange={handlechangeS}
            value={name}
            readOnly={!allowedit}
            onFocus={(e) => {
              if (!allowedit) e.target.blur();
            }}
          />
          <Image
            onClick={handleEditClick}
            src={`${!allowedit ? "/edit.png" : "/check.png"}`}
            height={20}
            width={20}
            alt="edit"
          ></Image>
        </div>
      </div>
      <div className={styles.editname}>
        <div className={styles.editnameheadiing}>About</div>
        <div className={styles.editnamecont}>
          <input
            ref={inputRefabout}
            className={styles.editnameinput}
            type="text"
            onChange={handleaboutchangeS}
            value={aboutinfo}
            readOnly={!alloweditabout}
            onFocus={(e) => {
              if (!alloweditabout) e.target.blur();
            }}
          />
          <Image
            onClick={handleAboutEditClick}
            src={`${!alloweditabout ? "/edit.png" : "/check.png"}`}
            height={20}
            width={20}
            alt="edit"
          ></Image>
        </div>
      </div>
      <div></div>
    </div>
  );
};

export default Profile;
