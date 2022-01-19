
import {
  Button,
  FileUploaderDropContainer,
  Form,
  Tag,
  TextInput,
} from "carbon-components-react";
import React, {useState } from "react";

const Submit = () => {
  const [modiflag, setModiflag] = useState(true);
  const [err_msg, setError_msg] = useState<string | null>(null);

  const [coauthor, setCoauthor] = useState<string[]>([]);
  const [supervisors, setSupervisors] = useState<string[]>([]);

  let pdf_file = null;

  const user = getUser();

  const sendApplication = () => {
    /*post({
      name: user.name
      bio: user.bio
      school: user.school
      file: pdf_file
    })*/
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
          <a href="/about#form"> up to date</a>. By submitting an application,
          you agree to the
          <a href="/about#terms"> terms and conditions</a>.
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
        />

        <TextInput
          id="coauthors"
          name="coauthors"
          labelText="Co-authors"
          placeholder="Co-authors"
          style={{
            marginBottom: "1em",
          }}

          onKeyDown={(e)=>{
            if ((e.code === "Enter" || e.code === "Tab") && e.target.value){
              setCoauthor([...coauthor, e.target.value])
              e.target.value = ""
              e.preventDefault()
            }
          }}
        />

        <div>
          {coauthor.map((elem, i) => <Tag key={i} 
          
            onClick={(e)=>{
              e.preventDefault()
              coauthor.splice(i,1)
              setCoauthor([...coauthor])

            
          }}>{elem}</Tag>)}
        </div>
        

        <TextInput
          id="supervisors"
          name="supervisors"
          labelText="Supervisors"
          placeholder="Supervisors"
          style={{
            marginBottom: "1em",
          }}

          onKeyDown={(e)=>{
            if ((e.code === "Enter" || e.code === "Tab") && e.target.value){
              setSupervisors([...supervisors, e.target.value])
              e.target.value = ""
              e.preventDefault()
            }
          }}
        />

        <div>
          {supervisors.map((elem, i) => <Tag key={i} 
          
            onClick={(e)=>{
              e.preventDefault()
              supervisors.splice(i,1)
              setSupervisors([...supervisors])

            
          }}>{elem}</Tag>)}
        </div>
        

        <FileUploaderDropContainer
          name="Form upload"
          style={{
            width: "80%",
            margin: "1.2em auto 2.4em 0",
          }}
          labelText="Drag and drop or click to select the Submission form in the format of PDF"
          accept={[".pdf"]}
          multiple={false}
          onAddFiles={
            //I would like to have these as typed but
            //  _event doesnt matter to me so i will no bother to try and figure out what the thing was asking for
            //  addedFiles should be a list of Files type but carbon components injects a custom field onto a FIle if its not the correct filetype that is not in the File Object
            (
              _event: any,
              content: {
                addedFiles: any[];
              }
            ) => {
              if (!content.addedFiles[0].invalidFileType == true) {
                pdf_file = content.addedFiles[0];
                if (user.name && user.bio && user.school) {
                  setModiflag(false);
                } else {
                  setError_msg(
                    "Please ensure that all of your account fields are filled out correctly before continuing with your application"
                  );
                }
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

const getUser = () => {
  return {
    name: "name",
    bio: "bio",
    school: "school",
  };
};
