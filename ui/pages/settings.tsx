import { Button, Form, Select, SelectItem, TextInput, TextArea } from "carbon-components-react";
import React, { useState } from "react";
import axios from "axios";

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

export async function getServerSideProps() {
  const data = await axios.get("http://localhost:8000/settings")
  return {
    props: { content: data.data },
  }
}

const Settings = (props: {content: configInterface}) => {
  const [form, setForm] = useState({
    emailProvider: props.content.emailProvider,
    emailUser: props.content.emailUser,
    emailToken: props.content.emailToken,
    oauthClientID: props.content.oauthConfig.oauthClientId,
    oauthClientSecret: props.content.oauthConfig.oauthClientSecret,
    landingPageMD: props.content.landingPageMD,
    signingKey: props.content.signingKey,
    dbUsername: props.content.databaseConfig.username,
    dbPassword: props.content.databaseConfig.password,
    dbHost: props.content.databaseConfig.host,
    dbPort: props.content.databaseConfig.port,
    dbName: props.content.databaseConfig.database,
  });

  const handleChange = (event: any) => {
    setForm({...form, [event.target.name]: event.target.value})
  }

  const onSubmit = (event: any) => {
    event.preventDefault()
    const newConfig: configInterface = {
      emailProvider: form.emailProvider,
      emailUser: form.emailUser,
      emailToken: form.emailToken,
      emailConfigs: props.content.emailConfigs,
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
    axios.post("https://localhost:8000/settings", newConfig)
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
              defaultValue={props.content.emailProvider}
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
              defaultValue={props.content.emailUser}
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
              defaultValue={props.content.emailToken}
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
              defaultValue={props.content.oauthConfig.oauthClientId}
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
              defaultValue={props.content.oauthConfig.oauthClientSecret}
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
              defaultValue={props.content.landingPageMD}
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
              defaultValue={props.content.signingKey}
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
              defaultValue={props.content.databaseConfig.host}
              onChange={handleChange}
            />
          </div>
          <div className="bx--col">
            <TextInput 
              id="dbPort"
              name="dbPort"
              labelText={"Database Port"}  
              placeholder="Database Port: 0-25565"
              defaultValue={props.content.databaseConfig.port}
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
              defaultValue={props.content.databaseConfig.username}
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
              defaultValue={props.content.databaseConfig.password}
              onChange={handleChange}
            />
          </div>
          <div className="bx--col">
            <TextInput 
              id="dbName"
              name="dbName"
              labelText={"Database Name"}  
              placeholder="Database Name"
              defaultValue={props.content.databaseConfig.database}
              onChange={handleChange}
            />
          </div>
        </div>
        <div style={{marginBottom: '2rem'}} className="bx--row">
          <div className="bx--col">
            <Button type="submit" onClick={onSubmit}>
              Update
            </Button>
          </div>
        </div>
      </Form>
    </>
  );
};

export default Settings;
