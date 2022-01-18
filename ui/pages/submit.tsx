import { Button, FileUploaderDropContainer } from "carbon-components-react";
import { userInfo } from "os";
import { useState } from "react";


const Submit = () => {

  const [modiflag, setModiflag] = useState(true);
  const [err_msg, setError_msg] = useState<string | null>(null);

  let pdf_file = null;

  const user = getUser();

  const sendApplication = () => {
    /*post({
      name: user.name
      bio: user.bio
      school: user.school
      file: pdf_file
    })*/
  }


  return (
    <>
      <FileUploaderDropContainer 
        name="Form upload"
        labelText="Drag and drop or click to select the Submission form in the format of PDF"
        accept={[".pdf"]}
        multiple={false}
        onAddFiles={
          
          //I would like to have these as typed but
          //  _event doesnt matter to me so i will no bother to try and figure out what the thing was asking for
          //  addedFiles should be a list of Files type but carbon components injects a custom field onto a FIle if its not the correct filetype that is not in the File Object
          (_event: any, content: {
          addedFiles: any[];
      })=>{
          if (!content.addedFiles[0].invalidFileType == true){
            pdf_file = content.addedFiles[0]
            if (user.name && user.bio && user.school){
              setModiflag(false)
            }else{
              setError_msg("Please ensure that all of your account fields are filled out correctly before continuing with your application")
            }
            
          }else{
            setModiflag(false)
          }
          
        }}

      />
      <Button
        disabled={modiflag}
        onClick={sendApplication}
      >
        Submit Your Application
      </Button>
      {
        err_msg? <p style={{color:"red"}}>{err_msg}</p>: <></>
      }
    </>
  );
};

export default Submit;

const getUser = () => {
    return {
        name: "name",
        bio: "bio",
        school: "school"
    }
}
