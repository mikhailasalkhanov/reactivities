import { Formik, Form, ErrorMessage } from "formik";
import { observer } from "mobx-react-lite";
import { Button, Header, Label } from "semantic-ui-react";
import MyTextInput from "../../app/common/form/MyTextInput";
import { useStore } from "../../app/strores/store";

export default observer(function LoginForm() {
  const { userStore } = useStore();

  return (
    <Formik
      initialValues={{ email: '', password: '', error: null }}
      onSubmit={(values, { setErrors }) =>
        userStore.login(values)
          .catch(() =>
            setErrors({ error: 'Invalid password or email' }))}
    >
      {({ handleSubmit, isSubmitting, errors }) => (
        <Form className='ui form' onSubmit={handleSubmit} autoComplete='off' style={{width:'100%'}}>
          <Header as={'h2'} content='Login to Reactivities' color='teal' textAlign='center' />
          <MyTextInput placeholder='Email' name='email' />
          <MyTextInput placeholder='Password' name='password' type='password' />
          <ErrorMessage
            name='error'
            render={() =>
              <Label style={{ marginBottom: 10 }} basic color='red' content={errors.error} />}
          />
          <Button loading={isSubmitting} positive content='Log in' type='submit' fluid />
        </Form>
      )}
    </Formik>

  )
})
