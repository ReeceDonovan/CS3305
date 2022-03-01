import {
  Button,
  Form,
  Select,
  SelectItem,
  TextInput,
  TextArea,
  Tag,
} from "carbon-components-react";
import React, { useContext, useEffect, useState } from "react";
import { configInterface, emailConfig } from "../../api/types";
import { NetworkManagerContext } from "../../components/NetworkManager";

const Settings = () => {
  const [isSubmitting, setSubmitting] = useState(false);
  const [emailProvider, setEmailProvider] = useState<string>("");
  const [emailUser, setEmailUser] = useState<string>("");
  const [emailToken, setEmailToken] = useState<string>("");
  const [emailConfigs, setEmailConfigs] = useState<emailConfig[]>([]);
  const [oauthClientID, setOAuthClientID] = useState<string>("");
  const [oauthClientSecret, setOAuthClientSecret] = useState<string>("");
  const [allowedDomains, setAllowedDomains] = useState<string[]>([]);
  const [landingPageMD, setLandingPageMD] = useState<string>("");
  const [signingKey, setSigningKey] = useState<string>("");
  const [dbUsername, setDBUsername] = useState<string>("");
  const [dbPassword, setDBPassword] = useState<string>("");
  const [dbHost, setDBHost] = useState<string>("");
  const [dbPort, setDBPort] = useState<number>(0);
  const [dbName, setDBName] = useState<string>("");

  const [isLoading, setLoading] = useState(true);

  const nm_ctx = useContext(NetworkManagerContext);

  useEffect(() => {
    async () => {
      if (isLoading) {
        nm_ctx
          .request({ path: "/admin/settings", method: "GET" })
          .then(([res, err_code]) => {
            if (err_code === 0) {
              setEmailProvider(res.data.emailProvider);
              setEmailUser(res.data.emailUser);
              setEmailToken(res.data.emailToken);
              setEmailConfigs(res.data.emailConfigs);
              setOAuthClientID(res.data.oauthConfig.oauthClientId);
              setOAuthClientSecret(res.data.oauthConfig.oauthClientSecret);
              setAllowedDomains(res.data.oauthConfig.allowedDomains);
              setLandingPageMD(res.data.landingPageMD);
              setSigningKey(res.data.signingKey);
              setDBUsername(res.data.databaseConfig.username);
              setDBPassword(res.data.databaseConfig.password);
              setDBHost(res.data.databaseConfig.host);
              setDBPort(res.data.databaseConfig.port);
              setDBName(res.data.databaseConfig.database);
            }
          });
      }
      setLoading(false);
    };
  }, [isLoading, nm_ctx]);

  const onSubmit = (event: any) => {
    setSubmitting(true);
    event.preventDefault();
    const newConfig: configInterface = {
      emailProvider,
      emailUser,
      emailToken,
      emailConfigs,
      oauthConfig: {
        oauthClientId: oauthClientID,
        oauthClientSecret: oauthClientSecret,
        allowedDomains: allowedDomains,
      },
      signingKey,
      landingPageMD,
      databaseConfig: {
        host: dbHost,
        port: dbPort,
        username: dbUsername,
        password: dbPassword,
        database: dbName,
      },
    };
    nm_ctx
      .request({ path: "/admin/settings", method: "POST", data: newConfig })
      .then((_res) => {
        setSubmitting(false);
      })
      .catch((_err) => {
        setSubmitting(false);
      });
  };

  return (
    <>
      <Form
        className="bx--grid bx--grid--narrow"
        style={{
          height: "100vh",
          width: "90%",
          margin: "0 auto 0 auto",
        }}
      >
        <h3 className="bx--row"> Email Settings </h3>
        <div style={{ marginBottom: "2rem" }} className="bx--row">
          <div className="bx--col-lg">
            <Select
              id="emailProvider"
              name="emailProvider"
              labelText="Select an Email Provider"
              defaultValue={emailProvider}
              onChange={(e) => {
                setEmailProvider(e.target.value);
              }}
            >
              {["Gmail", "Outlook"].map((e, i) => {
                return <SelectItem value={e.toLowerCase()} text={e} key={i} />;
              })}
            </Select>
          </div>
        </div>
        <div style={{ marginBottom: "2rem" }} className="bx--row">
          <div className="bx--col">
            <TextInput
              id="emailUser"
              name="emailUser"
              labelText={"Email User"}
              placeholder="Email User"
              defaultValue={emailUser}
              onChange={(e) => {
                setEmailUser(e.target.value);
              }}
            />
          </div>
          <div className="bx--col">
            <TextInput.PasswordInput
              id="emailToken"
              name="emailToken"
              labelText={"Email Token/Password"}
              placeholder="Email Token/Password"
              defaultValue={emailToken}
              onChange={(e) => {
                setEmailToken(e.target.value);
              }}
            />
          </div>
        </div>
        <div style={{ marginBottom: "2rem" }} className="bx--row">
          <div className="bx--col">
            <TextInput
              id="allowedDomains"
              name="allowedDomains"
              labelText="Allowed Email Domains for logging in"
              placeholder="Example: gmail.com"
              style={{
                marginBottom: "1em",
              }}
              onKeyDown={(e) => {
                const t = e.target as HTMLInputElement;
                if ((e.code === "Enter" || e.code === "Tab") && t.value) {
                  const t = e.target as HTMLInputElement;
                  if (
                    t.value &&
                    t.value.length > 0 &&
                    t.value.split(".").length > 1
                  ) {
                    setAllowedDomains([...allowedDomains, t.value]);
                    t.value = "";
                  }
                  e.preventDefault();
                }
              }}
            />

            <div>
              {allowedDomains.map((elem, i) => (
                <Tag
                  key={i}
                  onClick={(e) => {
                    e.preventDefault();
                    allowedDomains.splice(i, 1);
                    setAllowedDomains([...allowedDomains]);
                  }}
                >
                  {elem}
                </Tag>
              ))}
            </div>
          </div>
        </div>
        <h3 className="bx--row"> oauth Settings </h3>
        <div style={{ marginBottom: "2rem" }} className="bx--row">
          <div className="bx--col">
            <TextInput
              id="oauthClientID"
              name="oauthClientID"
              labelText={"OAuth Client ID"}
              placeholder="OAuth Client ID"
              defaultValue={oauthClientID}
              onChange={(e) => {
                setOAuthClientID(e.target.value);
              }}
            />
          </div>
          <div className="bx--col">
            <TextInput.PasswordInput
              id="oauthClientSecret"
              name="oauthClientSecret"
              labelText={"OAuth Secret"}
              placeholder="OAuth Secret"
              defaultValue={oauthClientSecret}
              onChange={(e) => {
                setOAuthClientSecret(e.target.value);
              }}
            />
          </div>
        </div>
        <h3 className="bx--row"> About Page Customization </h3>
        <div style={{ marginBottom: "2rem" }} className="bx--row">
          <div className="bx--col-lg-6">
            <TextArea
              helperText={[
                "You can use markdown here! Click ",
                <a
                  key="help"
                  href="https://github.com/adam-p/markdown-here/wiki/Markdown-Cheatsheet"
                >
                  here
                </a>,
                " for help.",
              ]}
              id="landingPageMD"
              name="landingPageMD"
              invalidText="Invalid Markdown"
              labelText="About Page Text"
              placeholder="# Write your first markdown"
              rows={4}
              defaultValue={landingPageMD}
              onChange={(e) => {
                setLandingPageMD(e.target.value);
              }}
            />
          </div>
          <div className="bx--col-lg-6">
            <div>Markdown Preview Placeholder</div>
          </div>
        </div>
        <h3 className="bx--row"> JWT Settings </h3>
        <div style={{ marginBottom: "2rem" }} className="bx--row">
          <div className="bx--col">
            <TextInput.PasswordInput
              id="signingKey"
              name="signingKey"
              labelText={"Signing Key"}
              placeholder="JWT Signing Key"
              defaultValue={signingKey}
              onChange={(e) => {
                setSigningKey(e.target.value);
              }}
            />
          </div>
        </div>
        <h3 className="bx--row"> Database Settings </h3>
        <div style={{ marginBottom: "2rem" }} className="bx--row">
          <div className="bx--col">
            <TextInput
              id="dbHost"
              name="dbHost"
              labelText={"Database Host"}
              placeholder="Database Host: database.example.com"
              defaultValue={dbHost}
              onChange={(e) => {
                setDBHost(e.target.value);
              }}
            />
          </div>
          <div className="bx--col">
            <TextInput
              id="dbPort"
              name="dbPort"
              labelText={"Database Port"}
              placeholder="Database Port: 0-25565"
              defaultValue={dbPort}
              onChange={(e) => {
                setDBPort(parseInt(e.target.value));
              }}
            />
          </div>
        </div>
        <div style={{ marginBottom: "2rem" }} className="bx--row">
          <div className="bx--col">
            <TextInput
              id="dbUsername"
              name="dbUsername"
              labelText={"Database Username"}
              placeholder="Database Username"
              defaultValue={dbUsername}
              onChange={(e) => {
                setDBUsername(e.target.value);
              }}
            />
          </div>
          <div className="bx--col">
            <TextInput.PasswordInput
              id="dbPassword"
              name="dbPassword"
              labelText={"Database Password"}
              placeholder="Database Password"
              defaultValue={dbPassword}
              onChange={(e) => {
                setDBPassword(e.target.value);
              }}
            />
          </div>
          <div className="bx--col">
            <TextInput
              id="dbName"
              name="dbName"
              labelText={"Database Name"}
              placeholder="Database Name"
              defaultValue={dbName}
              onChange={(e) => {
                setDBName(e.target.value);
              }}
            />
          </div>
        </div>
        <div style={{ marginBottom: "2rem" }} className="bx--row">
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
