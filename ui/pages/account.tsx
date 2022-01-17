import type { NextPage } from 'next'
import { Button, Form, TextInput } from 'carbon-components-react'

const AccountPage: NextPage = () => {

  const user = getUser();

  return (
    <>
      <Form>
          <TextInput
            id="name"
            labelText="Name"
            placeholder={user.name||"Bob Joe Name"}
          />

          <TextInput
            id="bio"
            labelText="Job Title"
            placeholder={user.bio||"Cool Lecturer and Researcher"}
          />

          <TextInput
            id="school"
            labelText="School"
            placeholder={user.school||"School of Rock"}
          />

          <Button 
            type="submit">
                Submit
          </Button>
      </Form>
    </>
  )
}

export default AccountPage

const getUser = () => {
    return {
        name: null,
        bio: null,
        school: null
    }
}