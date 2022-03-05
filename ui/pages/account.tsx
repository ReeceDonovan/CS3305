import { DocumentDownload16, Login32, Save32 } from "@carbon/icons-react";
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
  const [loading, setLoading] = useState(true);

  const nm_ctx = useContext(NetworkManagerContext);

  useEffect(() => {
    (async () => {
      if (loading) {
        const [res, err_code] = await nm_ctx.request({
          path: "/users",
          method: "GET",
        });

        if (err_code == 0) {
          const user = res.data as User;

          setEmail(user.email || "");
          setName(user.name || "");
          setBio(user.bio || "");
          setSchool(user.school || "");
        }
        setLoading(false);
      }
    })();
  }, [loading, nm_ctx]);

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
            kind="secondary"
            type="submit"
            onClick={async (e) => {
              e.preventDefault();
              const [res, err_code] = await nm_ctx.request({
                show_progress: true,
                method: "GET",
                path: "/users/",
              });
              if (err_code === 0) {
                const str = JSON.stringify(res.data);
                const bytes = new TextEncoder().encode(str);
                const blob = new Blob([bytes], {
                  type: "application/json;charset=utf-8",
                });

                // Stolen from https://github.com/eligrey/FileSaver.js/
                const a = document.createElement("a");
                const name = "your_data.txt";
                a.download = name;
                a.rel = "noopener"; // tabnabbing
                a.href = URL.createObjectURL(blob);
                a.click();
              }
            }}
            renderIcon={DocumentDownload16}
          >
            Request GDPR Data
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
