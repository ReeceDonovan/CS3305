import type { NextPage } from "next";
import { Button, Form, TextInput } from "carbon-components-react";
import React, { useContext, useEffect, useState } from "react";
import * as api from "../api";
import {
  Login32,
  Save32,
} from "@carbon/icons-react";
import styles from "../styles/account.module.css";
import NetworkManager, { NiceParams } from "../components/NetworkManager";

const AccountPage: NextPage = () => {
  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [school, setSchool] = useState("");

  const nm_ctx = useContext(NetworkManager);


  useEffect(() => {
    nm_ctx.request({
      path: "/users",
      method: "GET",
    }).then((user)=> {
      if (user.status == 200) {
        setName(user.data.name);
        setBio(user.data.bio);
        setSchool(user.data.school);
    }}).catch((_)=>{});
  }, []);

  

  return (
    <>
      <Form className={styles.form}>
        <TextInput
          className={styles.formElements}
          id="name"
          labelText="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <TextInput
          id="bio"
          labelText="Bio"
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          className={styles.formElements}
        />

        <TextInput
          id="school"
          labelText="School"
          value={school}
          onChange={(e) => setSchool(e.target.value)}
          className={styles.formElements}
        />

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Button
            kind="secondary"
            type="submit"
            style={{
              marginRight: 0,
            }}
            onClick={() => {
              api.deleteCredentials();
              window.location.href = "/";
            }}
            renderIcon={Login32}
          >
            Logout
          </Button>

          <Button
            type="submit"
            disabled={!name && !bio && !school}
            onClick={(e) => {
              e.preventDefault();
              nm_ctx.request({
                method: "PATCH",
                path: "/users",
                data: { name: name, bio: bio, school: school },
                show_progress: true
              }).catch();
            }}
            renderIcon={Save32}
          >
            Save
          </Button>
        </div>
      </Form>
    </>
  );
};

export default AccountPage;
