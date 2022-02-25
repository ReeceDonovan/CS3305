import {
  Button,
  Form,
  Select,
  SelectItem,
  TextInput,
  TextArea,
  Tag,
  Checkbox
} from "carbon-components-react";
import React, { useContext, useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import { configInterface } from "../../api/types";
import { NetworkManagerContext } from "../../components/NetworkManager";

const Settings = () => {
  const [isSubmitting, setSubmitting] = useState(false);
  // Misc Settings
  const [uiURL, setUiURL] = useState<string>("");
  const [apiURL, setApiURL] = useState<string>("");
  const [signingKey, setSigningKey] = useState<string>("");
  const [landingPageMD, setLandingPageMD] = useState<string>("");
  const [companyLogo, setCompanyLogo] = useState<string>("");
  // Email
  const [emailProvider, setEmailProvider] = useState<string>("gmail");
  const [emailLessSecure, setEmailLessSecure] = useState<boolean>(false);
  const [emailUser, setEmailUser] = useState<string>("");
  const [emailClientID, setEmailClientID] = useState<string>("");
  const [emailToken, setEmailToken] = useState<string>("");
  const [emailRefreshToken, setEmailRefreshToken] = useState<string>("");
  const [emailPort, setEmailPort] = useState<number>(0);
  const [emailHost, setEmailHost] = useState<string>("");
  const [emailSecure, setEmailSecure] = useState<boolean>(false);
  const [emailCiphers, setCiphers] = useState<string>("");
  // oAuth
  const [oauthClientID, setOAuthClientID] = useState<string>("");
  const [oauthClientSecret, setOAuthClientSecret] = useState<string>("");
  const [allowedDomains, setAllowedDomains] = useState<string[]>([]);
  // Database
  const [dbUsername, setDBUsername] = useState<string>("");
  const [dbPassword, setDBPassword] = useState<string>("");
  const [dbHost, setDBHost] = useState<string>("");
  const [dbPort, setDBPort] = useState<number>(0);
  const [dbName, setDBName] = useState<string>("");

  const [isLoading, setLoading] = useState(true);

  const nm_ctx = useContext(NetworkManagerContext);

  useEffect(() => {
    async () => {
      nm_ctx
        .request({ path: "/admin/settings", method: "GET" })
        .then(([res, err_code]) => {
          if (err_code === 0) {
            setUiURL(res.data.uiURL);
            setApiURL(res.data.apiURL);
            setSigningKey(res.data.signingKey);
            setLandingPageMD(res.data.landingPageMD);
            setCompanyLogo(res.data.companyLogo);
      
            setEmailProvider(res.data.emailConfig.provider);
            setEmailLessSecure(res.data.emailConfig.lessSecure);
            setEmailUser(res.data.emailConfig.user);
            setEmailClientID(res.data.emailConfig.clientId);
            setEmailToken(res.data.emailConfig.token);
            setEmailRefreshToken(res.data.emailConfig.refreshToken);
            setEmailHost(res.data.emailConfig.host);
            setEmailPort(res.data.emailConfig.port);
            setEmailSecure(res.data.emailConfig.emailSecure);
            setCiphers(res.data.emailConfig.tls.ciphers);
            
            setOAuthClientID(res.data.oauthConfig.oauthClientId);
            setOAuthClientSecret(res.data.oauthConfig.oauthClientSecret);
            setAllowedDomains(res.data.oauthConfig.allowedDomains);

            setDBUsername(res.data.databaseConfig.username);
            setDBPassword(res.data.databaseConfig.password);
            setDBHost(res.data.databaseConfig.host);
            setDBPort(res.data.databaseConfig.port);
            setDBName(res.data.databaseConfig.database);
          }
        });
      setLoading(false);
    };
  }, [isLoading, nm_ctx]);

  const onSubmit = (event: any) => {
    setSubmitting(true);
    event.preventDefault();
    const newConfig: configInterface = {
      uiURL,
      apiURL,
      signingKey,
      landingPageMD,
      companyLogo,
      emailConfig: {
        provider: emailProvider,
        lessSecure: emailLessSecure,
        user: emailUser,
        clientId: emailClientID,
        token: emailToken,
        refreshToken: emailRefreshToken,
        host: emailHost,
        port: emailPort,
        secure: emailSecure,
        tls: {
          ciphers: emailCiphers
        }
      },
      oauthConfig: {
        oauthClientId: oauthClientID,
        oauthClientSecret: oauthClientSecret,
        allowedDomains: allowedDomains,
      },
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
      .then((_) => {
        setSubmitting(false);
      })
      .catch((_) => {
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
        <h3 className="bx--row"> General Settings </h3>
        <div style={{ marginBottom: "2rem" }} className="bx--row">
          <div className="bx--col">
            <TextInput
              id="uiURL"
              name="uiURL"
              labelText={"Webpage URL"}
              placeholder="Webpage URL"
              defaultValue={uiURL}
              onChange={(e) => {
                setUiURL(e.target.value);
              }}
            />
          </div>
          <div className="bx--col">
            <TextInput
              id="apiURL"
              name="apiURL"
              labelText={"API URL"}
              placeholder="API URL"
              defaultValue={apiURL}
              onChange={(e) => {
                setApiURL(e.target.value);
              }}
            />
          </div>
        </div>
        <div style={{ marginBottom: "2rem" }} className="bx--row">
          <div className="bx--col">
            <TextInput
              id="companyLogo"
              name="companyLogo"
              labelText={"Company Logo Link"}
              placeholder="Company Logo Link"
              defaultValue={companyLogo}
              onChange={(e) => {
                setCompanyLogo(e.target.value);
              }}
            />
          </div>
        </div>
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
              {["Gmail", "Outlook", "Zoho", "Custom"].map((e, i) => {
                return <SelectItem value={e.toLowerCase()} text={e} key={i} />;
              })}
            </Select>
            {emailProvider == "gmail" ? <Checkbox id="lessSecure" labelText="Less Secure" defaultChecked={emailLessSecure} onChange={(_e: any) => {setEmailLessSecure(!emailLessSecure)}} /> : null }
          </div>
        </div>
        {emailProvider == "custom" ? <div style={{ marginBottom: "2rem" }} className="bx--row">
          <div className="bx--col">
            <TextInput
              id="emailHost"
              name="emailHost"
              labelText={"Host"}
              placeholder="Host"
              defaultValue={emailHost}
              onChange={(e) => { setEmailHost(e.target.value) }}
            />
          </div>
          <div className="bx--col">
            <TextInput
              id="emailPort"
              name="emailPort"
              labelText={"Port"}
              placeholder="Port"
              defaultValue={emailPort}
              onChange={(e) => { setEmailPort(Number(e.target.value)) }}
            />
          </div>
        </div> : null}
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
        {(!emailLessSecure && emailProvider === "gmail") ? <div style={{ marginBottom: "2rem" }} className="bx--row">
          <div className="bx--col">
            <TextInput.PasswordInput
              id="emailClientID"
              name="emailClientID"
              labelText={"Email Client ID"}
              placeholder="Email Client ID"
              defaultValue={emailClientID}
              onChange={(e) => { setEmailClientID(e.target.value) }}
            />
          </div>
          <div className="bx--col">
            <TextInput.PasswordInput
              id="emailRefreshToken"
              name="emailRefreshToken"
              labelText={"Email Refresh Token"}
              placeholder="Email Refresh Token"
              defaultValue={emailRefreshToken}
              onChange={(e) => { setEmailRefreshToken(e.target.value) }}
            />
          </div>
        </div> : null}
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
              style={{maxHeight: "40rem"}}
              onChange={(e) => {
                setLandingPageMD(e.target.value);
              }}
            />
          </div>
          <div className="bx--col-lg-6">
            <label className="bx--label">Preview</label>
            <div className="bx--text-area:disabled bx--text-area" style={{maxHeight: "40rem", marginBottom: "2rem"}}>
              <ReactMarkdown>{landingPageMD}</ReactMarkdown>
            </div>
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
