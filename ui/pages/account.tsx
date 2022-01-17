import type { NextPage } from 'next'
import { Button, Form, TextInput} from 'carbon-components-react'
import React, {useState} from 'react'


const AccountPage: NextPage = () => {

  const user = getUser();


  const [modiflag, setModiflag] = useState(true);

  let name_ref = React.createRef<HTMLInputElement>();
  let bio_ref = React.createRef<HTMLInputElement>();
  let school_ref = React.createRef<HTMLInputElement>();
  

  const checkModified = () => {
    console.log("halp")
    if (name_ref?.current?.value != user.name || bio_ref?.current?.value != user.bio || school_ref?.current?.value != user.school){
        setModiflag(false);
    }
    console.log(modiflag)
  }

  return(
    <>
      <Form>
          <TextInput
            id="name"
            labelText="Name"
            placeholder={user.name||"Bob Joe Name"}
            onBlur={checkModified}
            ref={name_ref}
          />

          <TextInput
            id="bio"
            labelText="Job Title"
            placeholder={user.bio||"Cool Lecturer and Researcher"}
            onBlur={checkModified}
            ref={bio_ref}
          />

          <TextInput
            id="school"
            labelText="School"
            placeholder={user.school||"School of Rock"}
            onBlur={checkModified}
            ref={school_ref}
          />

          <Button 
            type="submit"
            disabled={modiflag}
          >
            Submit
          </Button>
      </Form>
    </>
  )
}

export default AccountPage

const getUser = () => {
    return {
        name: "name",
        bio: null,
        school: null
    }
}