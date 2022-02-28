import { Login32, Save32 } from "@carbon/icons-react";
import { Button, Form, TextInput } from "carbon-components-react";
import type { NextPage } from "next";
import React, { useEffect, useState, useContext } from "react";
import * as api from "../api";
import styles from "../styles/account.module.css";
import { NetworkManagerContext } from "../components/NetworkManager";
import { User } from "../api/types";

const AccountPage: NextPage = () => {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [school, setSchool] = useState("");

  const nm_ctx = useContext(NetworkManagerContext);

  useEffect(() => {
    (async () => {
      const [res, err_code] = await nm_ctx.request({
        path: "/users",
        method: "GET",
      });
      const user: User = res.data;
      if (err_code === 0) {
        setEmail(user.email ? user.email : "");
        setName(user.name ? user.name : "");
        setBio(user.bio ? user.bio : "");
        setSchool(user.school ? user.school : "");
      }
    })();
  }, []);

  return (
    <>
      <Form className={styles.form}>
        <h1
          style={{
            marginBottom: "1rem",
          }}
        >
          {email}
        </h1>
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
                show_progress: true,
              });
            }}
          >
            Save
          </Button>
        </div>
      </Form>
    </>
  );
};

export default AccountPage;
