import { Button, Form, Select, SelectItem, TextInput, TextArea } from "carbon-components-react";
import React, { useEffect, useState } from "react";
import * as api from "../api";


interface configInterface {
  emailProvider: string;
  emailUser: string;
  emailToken: string;
  emailConfigs: Array<emailConfig>;
  oauthConfig: oauthConfig;
  signingKey: string;
  landingPageMD: string;
  databaseConfig: databaseConfig;
}

interface emailConfig {
  host: string;
  port: number;
  secure?: boolean;
  tls?: {
    ciphers?: string;
  };
}

interface oauthConfig {
  oauthClientId: string;
  oauthClientSecret: string;
}

interface databaseConfig {
  host: string;
  port: number;
  username: string;
  password: string;
  database: string;
}

const Settings = () => {
  const [isSubmitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    emailProvider: '',
    emailUser: '',
    emailToken: '',
    emailConfigs: [],
    oauthClientID: '',
    oauthClientSecret: '',
    landingPageMD: '',
    signingKey: '',
    dbUsername: '',
    dbPassword: '',
    dbHost: '',
    dbPort: 0,
    dbName: '',
  });

  useEffect(() => {
    api.request({path: '/admin/settings', method: 'GET'}).then(
      (res) => 
      {
        console.log(res)
        if (res.status === 200) {
        setForm({
        emailProvider: res.data.emailProvider,
        emailUser: res.data.emailUser,
        emailToken: res.data.emailToken,
        emailConfigs: res.data.emailConfigs,
        oauthClientID: res.data.oauthConfig.oauthClientId,
        oauthClientSecret: res.data.oauthConfig.oauthClientSecret,
        landingPageMD: res.data.landingPageMD,
        signingKey: res.data.signingKey,
        dbUsername: res.data.databaseConfig.username,
        dbPassword: res.data.databaseConfig.password,
        dbHost: res.data.databaseConfig.host,
        dbPort: res.data.databaseConfig.port,
        dbName: res.data.databaseConfig.database,
      })} 
    }
    )
  }, [])


  const handleChange = (event: any) => {
    setForm({...form, [event.target.name]: event.target.value})
  }

  const onSubmit = (event: any) => {
    setSubmitting(true)
    event.preventDefault()
    const newConfig: configInterface = {
      emailProvider: form.emailProvider,
      emailUser: form.emailUser,
      emailToken: form.emailToken,
      emailConfigs: form.emailConfigs,
      oauthConfig: {
        oauthClientId: form.oauthClientID,
        oauthClientSecret: form.oauthClientSecret
      },
      signingKey: form.signingKey,
      landingPageMD: form.landingPageMD,
      databaseConfig: {
        host: form.dbHost,
        port: form.dbPort,
        username: form.dbUsername,
        password: form.dbPassword,
        database: form.dbName
      }
    }
    api.request({path: "/admin/settings", method: 'POST', data: newConfig})
      .then(
        (_res) => {
          setSubmitting(false)
        })
      .catch(
        (_err) => {
          setSubmitting(false)
        }
      )
  }

  return (
    <>
      <Form
        className="bx--grid bx--grid--narrow"
        style={{
          height: "100vh",
          width: "90%",
          margin: "0 auto 0 auto"
        }}
      >
        <h3 className="bx--row"> Email Settings </h3>
        <div style={{marginBottom: '2rem'}} className="bx--row">
          <div className="bx--col-lg">
            <Select
              id="emailProvider"
              name="emailProvider"
              labelText="Select an Email Provider"
              defaultValue={form.emailProvider}
              onChange={handleChange}
            >
              {
                ["Gmail", "Outlook"].map((e, i) => {
                  return (<SelectItem value={e.toLowerCase()} text={e} key={i}/>)
                })
              }
            </Select>
          </div>
        </div>
        <div style={{marginBottom: '2rem'}} className="bx--row">
          <div className="bx--col">
            <TextInput 
              id="emailUser"
              name="emailUser"
              labelText={"Email User"}  
              placeholder="Email User"
              defaultValue={form.emailUser}
              onChange={handleChange}
            />
          </div>
          <div className="bx--col">
            <TextInput 
              id="emailToken"
              name="emailToken"
              labelText={"Email Token/Password"}
              placeholder="Email Token/Password"
              type="password"
              defaultValue={form.emailToken}
              onChange={handleChange}
            />
          </div>
        </div>
        <h3 className="bx--row"> oauth Settings </h3> 
        <div style={{marginBottom: '2rem'}} className="bx--row">
          <div className="bx--col">
            <TextInput 
              id="oauthClientID"
              name="oauthClientID"
              labelText={"OAuth Client ID"}  
              placeholder="OAuth Client ID"
              defaultValue={form.oauthClientID}
              onChange={handleChange}
            />
          </div>
          <div className="bx--col">
            <TextInput 
              id="oauthClientSecret"
              name="oauthClientSecret"
              labelText={"OAuth Secret"}
              placeholder="OAuth Secret"
              type="password"
              defaultValue={form.oauthClientSecret}
              onChange={handleChange}
            />
          </div>
        </div>
        <h3 className="bx--row"> About Page Customization </h3> 
        <div style={{marginBottom: '2rem'}} className="bx--row">
          <div className="bx--col-lg-6">
            <TextArea
              helperText={["You can use markdown here! Click ", <a key="help" href="https://github.com/adam-p/markdown-here/wiki/Markdown-Cheatsheet">here</a>, " for help."]}
              id="landingPageMD"
              name="landingPageMD"
              invalidText="Invalid Markdown"
              labelText="About Page Text"
              placeholder="# Write your first markdown"
              rows={4}
              defaultValue={form.landingPageMD}
              onChange={handleChange}
            />
          </div>
          <div className="bx--col-lg-6">
            <div>
              Markdown Preview Placeholder
            </div>
         </div>
        </div>
        <h3 className="bx--row"> JWT Settings </h3>
        <div style={{marginBottom: '2rem'}} className="bx--row">
          <div className="bx--col">
            <TextInput 
              id="signingKey"
              name="signingKey"
              labelText={"Signing Key"}  
              placeholder="JWT Signing Key"
              type="password"
              defaultValue={form.signingKey}
              onChange={handleChange}
            />
          </div>
        </div>
        <h3 className="bx--row"> Database Settings </h3>
        <div style={{marginBottom: '2rem'}} className="bx--row">
          <div className="bx--col">
            <TextInput 
              id="dbHost"
              name="dbHost"
              labelText={"Database Host"}  
              placeholder="Database Host: database.example.com"
              defaultValue={form.dbHost}
              onChange={handleChange}
            />
          </div>
          <div className="bx--col">
            <TextInput 
              id="dbPort"
              name="dbPort"
              labelText={"Database Port"}  
              placeholder="Database Port: 0-25565"
              defaultValue={form.dbPort}
              onChange={handleChange}
            />
          </div>
        </div>
        <div style={{marginBottom: '2rem'}} className="bx--row">
          <div className="bx--col">
            <TextInput 
              id="dbUsername"
              name="dbUsername"
              labelText={"Database Username"}  
              placeholder="Database Username"
              defaultValue={form.dbUsername}
              onChange={handleChange}
            />
          </div>
          <div className="bx--col">
            <TextInput 
              id="dbPassword"
              name="dbPassword"
              labelText={"Database Password"}  
              placeholder="Database Password"
              type="password"
              defaultValue={form.dbPassword}
              onChange={handleChange}
            />
          </div>
          <div className="bx--col">
            <TextInput 
              id="dbName"
              name="dbName"
              labelText={"Database Name"}  
              placeholder="Database Name"
              defaultValue={form.dbName}
              onChange={handleChange}
            />
          </div>
        </div>
        <div style={{marginBottom: '2rem'}} className="bx--row">
          <div className="bx--col">
            <Button type="submit" onClick={onSubmit} disabled={isSubmitting}>
              Update
            </Button>
          </div>
        </div>
      </Form>
    </>
  );
};

export default Settings;
