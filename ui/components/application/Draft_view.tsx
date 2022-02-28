import {
  Button,
  Form,
  Link,
  Tag,
  TextArea,
  TextInput,
} from "carbon-components-react";
import { useContext, useState } from "react";
import CustomFileUploader from "../CustomFileUploader";
import { NetworkManagerContext } from "../NetworkManager";

const Draft_view = (props: { id?: string; init_app?: any | null }) => {
  const init_app = props.init_app ? props.init_app : {};
  const [name, setName] = useState<string>(init_app?.name ? init_app.name : "");
  const [description, setDescription] = useState<string>(
    init_app?.description ? init_app.description : ""
  );
  const [field, setField] = useState<string>(
    init_app?.field ? init_app.field : ""
  );
  const [coauthors, setCoauthor] = useState<string[]>([]);
  const [supervisors, setSupervisors] = useState<string[]>([]);

  const [sync_timeout, setSync_timeout] = useState<null | NodeJS.Timeout>(null);

  const [prev_app, setPrev_app] = useState<{
    name: string;
    description: string;
    field: string;
    coauthors: string[];
    supervisors: string[];
  }>({
    name,
    description,
    field,
    coauthors,
    supervisors,
  });

  const [app_id, setApp_id] = useState<string | null>(
    props.id ? props.id : null
  );

  const emailRegexp = new RegExp(
    "^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$"
  );

  const nm_ctx = useContext(NetworkManagerContext);

  const sync_application = () => {
    setSync_timeout(null);

    //create diff application
    let modiflag = false;
    let diff_app = {} as {
      name: string;
      description: string;
      field: string;
      coauthors: string[];
      supervisors: string[];
      hasFile: boolean;
    };
    if (name != null && name != prev_app.name) {
      diff_app.name = name;
      modiflag = true;
    }
    if (description != null && description != prev_app.description) {
      diff_app.description = description;
      modiflag = true;
    }
    if (field != null && field != prev_app.field) {
      diff_app.field = field;
      modiflag = true;
    }
    if (
      JSON.stringify(coauthors.sort()) !=
      JSON.stringify(prev_app.coauthors.sort())
    ) {
      diff_app.coauthors = coauthors;
      modiflag = true;
    }
    if (
      JSON.stringify(supervisors.sort()) !=
      JSON.stringify(prev_app.supervisors.sort())
    ) {
      diff_app.supervisors = supervisors;
      modiflag = true;
    }

    if (modiflag === false) {
      if (sync_timeout != null) {
        clearTimeout(sync_timeout);
      }
      return;
    }

    setPrev_app({ ...prev_app, ...diff_app });
    nm_ctx.request({
      method: "PATCH",
      path: `/applications/${app_id}`,
      data: diff_app,
    });
  };

  const [getting_id, setGetting_id] = useState(false);

  const debounce_sync = async () => {
    //if id_get attempt is being attemped
    if (getting_id === true) return;
    //get id if it doesnt exist
    if (app_id === null) {
      // first negotiate a application id
      setGetting_id(true);
      const [res, err_code] = await nm_ctx.request({
        method: "POST",
        path: "/applications/",
      });
      setGetting_id(false);
      if (err_code === 0) {
        window.history.pushState(null, "", `/application/${res.data}`);
        setApp_id(res.data);
      }
    }

    if (sync_timeout == null) {
      setSync_timeout(setTimeout(sync_application, 2000));
    } else {
      clearTimeout(sync_timeout);
      setSync_timeout(setTimeout(sync_application, 2000));
    }
  };

  const [firstRender, setFirstRender] = useState(true);

  useEffect(() => {
    if (firstRender) {
      setFirstRender(false);
    } else {
      debounce_sync();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [coauthors, supervisors, name, description, field]);

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
          }}
        />

        <TextInput
          id="field"
          name="field"
          labelText="Field of study"
          placeholder="Field of study"
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
                  setCoauthor([...coauthors, t.value]);
                  t.value = "";
                }
              }
              e.preventDefault();
            }
          }}
        />

        <div>
          {coauthors.map((elem, i) => (
            <Tag
              key={i}
              onClick={(e) => {
                e.preventDefault();
                coauthors.splice(i, 1);
                setCoauthor([...coauthors]);
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
                  setSupervisors([...supervisors, t.value]);
                  t.value = "";
                }
              }
              e.preventDefault();
            }
          }}
        />

        <div>
          {supervisors.map((elem, i) => (
            <Tag
              key={i}
              onClick={async (e) => {
                e.preventDefault();
                supervisors.splice(i, 1);
                setSupervisors([...supervisors]);
              }}
            >
              {elem}
            </Tag>
          ))}
        </div>

        <CustomFileUploader
          remote_file_url={app_id ? `/applications/${app_id}/form` : undefined}
          get_remote_file_url={async () => {
            console.log("getting app id");
            const [res, err_code] = await nm_ctx.request({
              method: "POST",
              path: "/applications/",
            });
            if (err_code === 0) {
              setApp_id(res.data);
              window.history.pushState(null, "", `/application/${res.data}`);
              return `/applications/${res.data}/form`;
            }
            return "";
          }}
          init_file={init_app.hasFile ? "form.pdf" : undefined}
        />
        <Button
          disabled={app_id ? false : true}
          onClick={() => {
            nm_ctx.request({
              method: "PATCH",
              path: `/applications/${app_id}`,
              data: { app_status: "PENDING" },
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
