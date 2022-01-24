import type { NextPage } from "next";
import { Button, Form, Select, SelectItem, TextInput, TextArea } from "carbon-components-react";
import React, { useState } from "react";

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

const serverSettingsPage: NextPage = () => {
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
              defaultValue="gmail"
              id="emailProvider"
              labelText="Select an Email Provider"
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
              id={"emailUser"} 
              labelText={"Email User"}  
              placeholder="Email User"
            />
          </div>
          <div className="bx--col">
            <TextInput 
              id={"emailPassword"} 
              labelText={"Email Token/Password"}
              placeholder="Email Token/Password"
            />
          </div>
        </div>
        <h3 className="bx--row"> OAuth Settings </h3> 
        <div style={{marginBottom: '2rem'}} className="bx--row">
          <div className="bx--col">
            <TextInput 
              id={"OAuthClientID"} 
              labelText={"OAuth Client ID"}  
              placeholder="OAuth Client ID"
            />
          </div>
          <div className="bx--col">
            <TextInput 
              id={"OAuthSecret"} 
              labelText={"OAuth Secret"}
              className="bx--col"
              placeholder="OAuth Secret"
            />
          </div>
        </div>
        <h3 className="bx--row"> About Page Customization </h3> 
        <div style={{marginBottom: '2rem'}} className="bx--row">
          <div className="bx--col-lg-6">
            <TextArea
              helperText={["You can use markdown here! Click ", <a key="help" href="https://github.com/adam-p/markdown-here/wiki/Markdown-Cheatsheet">here</a>, " for help."]}
              id="test5"
              invalidText="Invalid Markdown"
              labelText="About Page Text"
              placeholder="# Write your first markdown"
              rows={4}
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
              id={"signingKey"} 
              labelText={"Signing Key"}  
              className="bx--col"
              placeholder="JWT Signing Key"
            />
          </div>
        </div>
        <h3 className="bx--row"> Database Settings </h3>
        <div style={{marginBottom: '2rem'}} className="bx--row">
          <div className="bx--col">
            <TextInput 
              id={"dbHost"} 
              labelText={"Database Host"}  
              className="bx--col"
              placeholder="Database Host: database.example.com"
            />
          </div>
          <div className="bx--col">
            <TextInput 
              id={"dbPort"} 
              labelText={"Database Port"}  
              className="bx--col"
              placeholder="Database Port: 0-25565"
            />
          </div>
        </div>
        <div style={{marginBottom: '2rem'}} className="bx--row">
          <div className="bx--col">
            <TextInput 
              id={"dbUsername"} 
              labelText={"Database Username"}  
              className="bx--col"
              placeholder="Database Username"
            />
          </div>
          <div className="bx--col">
            <TextInput 
              id={"dbPassword"} 
              labelText={"Database Password"}  
              className="bx--col"
              placeholder="Database Password"
            />
          </div>
          <div className="bx--col">
            <TextInput 
              id={"dbName"} 
              labelText={"Database Name"}  
              className="bx--col"
              placeholder="Database Name"
            />
          </div>
        </div>
        <div style={{marginBottom: '2rem'}} className="bx--row">
          <div className="bx--col">
            <Button type="submit">
              Update
            </Button>
          </div>
        </div>
      </Form>
    </>
  );
};

export default serverSettingsPage;
