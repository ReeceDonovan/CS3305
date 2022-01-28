import {
  Button,
  FileUploaderDropContainer,
  Form,
  Tag,
  TextArea,
  TextInput,
} from "carbon-components-react";
import Link from "next/link";
import React, { KeyboardEvent, useState } from "react";
import * as api from "../api";

const Submit = () => {
  const [modiflag, setModiflag] = useState(false);
  const [err_msg, setError_msg] = useState<string | null>(null);

  const [name, setName] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [field, setField] = useState<string>("");
  const [coauthors, setCoauthor] = useState<string[]>([]);
  const [supervisors, setSupervisors] = useState<string[]>([]);

  const [pdfFile, setPdfFile] = useState<File>();

  // let pdf_files: File[] = [];

  const emailRegexp = new RegExp(
    "^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$"
  );

  const sendApplication = async () => {
    console.log(pdfFile, "bruh");
    const form_data = new FormData();
    // for (let i = 0; i < pdf_files.length; i++) {
    if (pdfFile) {
      form_data.append("pdf_form", pdfFile);
    } else {
      console.log("pepega");
    }

    form_data.append(
      "meta_data",
      JSON.stringify({
        name,
        description,
        field,
        coauthors,
        supervisors,
      })
    );
    console.log(form_data);

    api
      .request({
        method: "POST",
        path: "/applications",
        data: form_data,
      })
      .then((resp) => {
        if (resp.status != 201) {
          setError_msg(resp.message);
        }
      });
  };

  return (
    <>
      <div>
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
          Ensure that the document you are submitting is in PDF format and
          <Link href="/about#form"> up to date </Link>. By submitting an application,
          you agree to the
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
          onKeyDown={(e: KeyboardEvent) => {
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
              onClick={(e) => {
                e.preventDefault();

                supervisors.splice(i, 1);
                setSupervisors([...supervisors]);
              }}
            >
              {elem}
            </Tag>
          ))}
        </div>

        <FileUploaderDropContainer
          name="Form upload"
          style={{
            width: "80%",
            margin: "1.2em auto 2.4em 0",
          }}
          labelText="Drag and drop or click to select the Submission form in the format of PDF"
          accept={[".pdf"]}
          multiple={true}
          onAddFiles={
            // addedFiles extends File by adding a property
            (
              _event: any,
              content: {
                addedFiles: Array<File>;
              }
            ) => {
              // @ts-ignore
              if (!content.addedFiles[0].invalidFileType == true) {
                // pdf_files.push(content.addedFiles[0]);
                setPdfFile(content.addedFiles[0]);
                console.log(content);
                console.log(pdfFile, "added");
              } else {
                setModiflag(false);
              }
            }
          }
        />
        <Button disabled={modiflag} onClick={sendApplication}>
          Submit Your Application
        </Button>
        {err_msg ? <p style={{ color: "red" }}>{err_msg}</p> : <></>}
      </Form>
    </>
  );
};

export default Submit;
