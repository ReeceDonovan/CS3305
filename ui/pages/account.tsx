import type { NextPage } from "next";
import { Button, Dropdown, Form, TextInput } from "carbon-components-react";
import React, { useEffect, useState, useContext } from "react";

import * as api from "../api";
import { Login32, Save32 } from "@carbon/icons-react";
import styles from "../styles/account.module.css";
import { NetworkManagerContext } from "../components/NetworkManager";
import { User } from "../api/types";

const AccountPage: NextPage = () => {
  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [school, setSchool] = useState("");
  const [role, setRole] = useState("");

  const nm_ctx = useContext(NetworkManagerContext);

  useEffect(() => {
    async () => {
      const [res, err_code] = await nm_ctx.request({
        path: "/users",
        method: "GET",
      });
      const user: User = res.data;
      if (err_code === 0) {
        setName(user.name);
        setBio(user.bio);
        setSchool(user.field);
        setRole(user.data.role);
      }
    };
  }, []);

  let dropdown_items = [{id: "RESEARCHER", text: "RESEARCHER"}, {id: "REVIEWER", text: "REVIEWER"}, {id: "COORDINATOR", text: "COORDINATOR"}]

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

        <Dropdown 
           id="role"
           titleText="Role Select"
           helperText="Select your Role"
           label={role}
           items={dropdown_items}
           itemToString={(item) => (item ? item.text : '')}
           onChange={(e)=>{
             if (e.selectedItem){
              setRole(e.selectedItem.id)
             }
           }}
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
            disabled={!name && !bio && !school && !role}
            onClick={(e) => {
              e.preventDefault();
              nm_ctx.request({
                method: "PATCH",
                path: "/users",
                data: { name: name, bio: bio, school: school, role: role },
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
