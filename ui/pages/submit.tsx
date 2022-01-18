import { FileUploaderDropContainer } from "carbon-components-react";


const Submit = () => {

  let pdf_file = null;

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
          }
          
        }}

      />
    </>
  );
};

export default Submit;

const getUser = () => {
    return {
        name: "name",
        bio: null,
        school: null
    }
}
