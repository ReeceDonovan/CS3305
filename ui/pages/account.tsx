import type { NextPage } from "next";
import { Button, Form, TextInput } from "carbon-components-react";
import React, { useEffect, useState } from "react";
import get_me, { User } from "../api/user";
import { request } from "../api/index";
import { Checkmark32, Error32, InProgress32 } from "@carbon/icons-react";
import styles from "../styles/account.module.css";

const AccountPage: NextPage = () => {
  console.log(styles);
  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [school, setSchool] = useState("");
  // 0 is nothing, 1 is in progress, 2 is failure, 3 is success
  const [submit_success, setSubmit_success] = useState<number>(0);

  const [remoteUser, setRemoteUser] = useState<User | null>(null);
  // get_me().then((user: User)=>{
  //   console.log(user)
  //   if(user){
  //     setName(user.name)
  //   }
  // })

  let save_state = <> </>;
  if (submit_success === 1) {
    save_state = <InProgress32 className={styles.resultIcon} />;
  } else if (submit_success == 2) {
    save_state = <Error32 className={styles.resultIcon} />;
  } else if (submit_success == 3) {
    save_state = <Checkmark32 className={styles.resultIcon} />;
  } else {
    save_state = <> </>;
  }

  useEffect(() => {
    get_me().then((user: User) => {
      if (user) {
        console.log("yes", user);
        setName(user.name);
        setBio(user.bio);
        setSchool(user.school);
      }
    });
  }, []);

  return (
    <>
      <Form className={styles.form}>
        <TextInput
          className={styles.formElements}
          id="name"
          labelText="Name"
          placeholder={name}
          onChange={(e) => setName(e.target.value)}
        />

        <TextInput
          id="bio"
          labelText="Bio"
          placeholder={bio}
          onChange={(e) => setBio(e.target.value)}
          className={styles.formElements}
        />

        <TextInput
          id="school"
          labelText="School"
          placeholder={school}
          onChange={(e) => setSchool(e.target.value)}
          className={styles.formElements}
        />

        <Button
          className={styles.formElements}
          type="submit"
          disabled={!name && !bio && !school}
          onClick={(e) => {
            e.preventDefault();
            setSubmit_success(1);
            request({
              method: "POST",
              path: "/users",
              data: { name: name, bio: bio, school: school },
            }).then((res) => {
              if ((res.status = 200)) {
                setSubmit_success(3);
              } else {
                setSubmit_success(2);
              }
            });
          }}
        >
          Save
        </Button>

        {save_state}
      </Form>
    </>
  );
};

export default AccountPage;
