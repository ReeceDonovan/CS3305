import type { NextPage } from "next";
import { Button, Dropdown, Form, TextInput } from "carbon-components-react";
import React, { useEffect, useState } from "react";
import * as api from "../api";
import { request } from "../api/index";
import {
  Checkmark32,
  Error32,
  InProgress32,
  Login32,
  Save32,
} from "@carbon/icons-react";
import styles from "../styles/account.module.css";

const AccountPage: NextPage = () => {
  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [school, setSchool] = useState("");
  const [role, setRole] = useState("");

  // 0 is nothing, 1 is in progress, 2 is failure, 3 is success
  const [submit_success, setSubmit_success] = useState<number>(0);

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
    (async () => {
      const user = await api.request({
        path: "/users",
        method: "GET",
      });
      if (user.status == 200) {
        setName(user.data.name);
        setBio(user.data.bio);
        setSchool(user.data.school);
        setRole(user.data.role)
      }
    })();
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
              setSubmit_success(1);
              request({
                method: "PATCH",
                path: "/users",
                data: { name: name, bio: bio, school: school, role: role},
              }).then((res) => {
                if (res.status == 200) {
                  setSubmit_success(3);
                } else {
                  setSubmit_success(2);
                }
              });
            }}
            renderIcon={Save32}
          >
            Save
          </Button>
        </div>
        <span>{save_state}</span>
      </Form>
    </>
  );
};

export default AccountPage;
