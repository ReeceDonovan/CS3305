import {
  Button,
  Form,
  Link,
  Tag,
  TextArea,
  TextInput,
} from "carbon-components-react";
import { useContext, useEffect, useState } from "react";
import { StringExtendedApplication } from "../../api/types";
import CustomFileUploader from "../CustomFileUploader";
import { NetworkManagerContext } from "../NetworkManager";

const Draft_view = (props: {
  application: StringExtendedApplication;
  setApplication: React.Dispatch<
    React.SetStateAction<StringExtendedApplication | undefined>
  >;
  debounce_sync: () => {};
  request_id?: () => Promise<[string, number]>;
}) => {
  const nm_ctx = useContext(NetworkManagerContext);

  const app = props.application;

  const [name, setName] = useState(app.name);
  const [field, setField] = useState(app.field);
  const [description, setDescription] = useState(app.description);
  const [coauthors, setCoauthors] = useState(app.coauthors);
  const [supervisors, setSupervisors] = useState(app.supervisors);

  const emailRegexp = new RegExp(
    "^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$"
  );

  const [firstRender, setFirstRender] = useState(true);

  useEffect(() => {
    if (firstRender) {
      setFirstRender(false);
    } else {
      if (!name) return;
      app.name = name;
      app.field = field;
      app.description = description;
      app.coauthors = coauthors;
      app.supervisors = supervisors;
      props.setApplication(app);
      props.debounce_sync();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [name, field, description, coauthors, supervisors]);

  const [title_error, setTitle_error] = useState(false);

  return (
    <>
      <div
        style={{
          width: "80%",
          margin: "auto",
        }}
      >
        <h1
          style={{
            marginTop: "150px",
            textAlign: "center",
            fontSize: "4em",
          }}
        >
          Submit an SREC application
        </h1>
        <p
          style={{
            margin: "3.6em auto  1.2em auto",
            maxWidth: "90%",
          }}
        >
          Ensure that the document you are submitting is in PDF format and{" "}
          <Link href="/about#form">
            <a> up to date </a>
          </Link>
          . By submitting an application, you agree to the {"  "}
          <Link href="/about#terms"> terms and conditions </Link>.
        </p>

        <p
          style={{
            margin: "1.2em auto  3.6em auto",
            maxWidth: "90%",
          }}
        >
          Carefully read over your form, ensure all necessary fields are filled.
          Also make sure to include any co-authors and/or supervisors.
        </p>
      </div>
      <Form
        style={{
          width: "80%",
          margin: "0 auto 2.6em auto",
        }}
      >
        <TextInput
          id="name"
          name="name"
          labelText="Name of research project"
          placeholder="Name of research project"
          value={name}
          style={{
            marginBottom: "1em",
          }}
          onChange={(e) => {
            setName(e.target.value);
            setTitle_error(false);
          }}
          invalidText={"Title required"}
          invalid={title_error}
          onBlur={(e) => {
            if (e.target.value === "") {
              setTitle_error(true);
            }
          }}
        />

        <TextInput
          id="field"
          name="field"
          labelText="Field of study"
          placeholder="Field of study"
          value={field}
          style={{
            marginBottom: "1em",
          }}
          onChange={(e) => {
            setField(e.target.value);
          }}
        />

        <TextArea
          id="description"
          name="description"
          labelText="Brief description of research project"
          placeholder="Brief description"
          value={description}
          style={{
            marginBottom: "1em",
          }}
          onChange={(e) => {
            setDescription(e.target.value);
          }}
        />

        <TextInput
          id="coauthors"
          name="coauthors"
          labelText="Co-authors"
          placeholder="Co-authors"
          style={{
            marginBottom: "1em",
          }}
          onKeyDown={(e) => {
            const t = e.target as HTMLInputElement;
            if ((e.code === "Enter" || e.code === "Tab") && t.value) {
              const t = e.target as HTMLInputElement;
              if (t.value && t.value.length > 0) {
                if (emailRegexp.test(t.value)) {
                  setCoauthors([...(coauthors ? coauthors : []), t.value]);
                  t.value = "";
                }
              }
              e.preventDefault();
            }
          }}
        />

        <div>
          {coauthors?.map((elem, i) => (
            <Tag
              key={i}
              onClick={(e) => {
                e.preventDefault();
                coauthors?.splice(i, 1);
                setCoauthors(coauthors);
              }}
            >
              {elem}
            </Tag>
          ))}
        </div>

        <TextInput
          id="supervisors"
          name="supervisors"
          labelText="Supervisors"
          placeholder="Supervisors"
          style={{
            marginBottom: "1em",
          }}
          onKeyDown={(e) => {
            const t = e.target as HTMLInputElement;
            if ((e.code === "Enter" || e.code === "Tab") && t.value) {
              if (t && t.value.length > 0) {
                if (emailRegexp.test(t.value)) {
                  setSupervisors([
                    ...(supervisors ? supervisors : []),
                    t.value,
                  ]);
                  t.value = "";
                }
              }
              e.preventDefault();
            }
          }}
        />

        <div>
          {supervisors?.map((elem, i) => (
            <Tag
              key={i}
              onClick={async (e) => {
                e.preventDefault();
                supervisors?.splice(i, 1);
                setSupervisors(supervisors);
              }}
            >
              {elem}
            </Tag>
          ))}
        </div>

        <CustomFileUploader
          remote_file_url={app.id ? `/applications/${app.id}/form` : undefined}
          get_remote_file_url={async () => {
            console.log("getting app id");
            const [res, err_code] = await props.request_id();
            if (err_code === 0) {
              app.id = parseInt(res);
              props.setApplication(app);
              window.history.pushState(null, "", `/application/${app.id}`);
              return `/applications/${app.id}/form`;
            }
            return "";
          }}
          init_file={app.hasFile ? "form.pdf" : undefined}
        />
        <Button
          disabled={app.id ? false : true}
          onClick={() => {
            nm_ctx.request({
              method: "PATCH",
              path: `/applications/${app.id}`,
              data: { app_status: "SUBMITTED" },
              show_progress: true,
            });
          }}
        >
          Submit Your Application
        </Button>
      </Form>
    </>
  );
};

export default Draft_view;
