import { Formik, Form, ErrorMessage } from "formik";
import { observer } from "mobx-react-lite";
import { Button, Header, Label } from "semantic-ui-react";
import MyTextInput from "../../app/common/form/MyTextInput";
import { useStore } from "../../app/strores/store";
import * as Yup from 'yup';
import ValidationError from "../errors/ValidationError";

export default observer(function RegisterForm() {
  const { userStore } = useStore();

  return (
    <Formik
      initialValues={{ displayName: '', username: '', email: '', password: '', error: null }}
      onSubmit={(values, { setErrors }) =>
        userStore.register(values)
          .catch((error) =>
            setErrors({error}))}
      validationSchema={Yup.object({
        displayName: Yup.string().required(),
        username: Yup.string().required(),
        email: Yup.string().required(),
        password: Yup.string().required(),
      })}
    >
      {({ handleSubmit, isSubmitting, errors, isValid, dirty }) => (
        <Form className='ui form error' onSubmit={handleSubmit} autoComplete='off'>
          <Header as={'h2'} content='Sign up to Reactivities' color='teal' textAlign='center' />
          <MyTextInput placeholder='Email' name='email' />
          <MyTextInput placeholder='Display Name' name='displayName' />
          <MyTextInput placeholder='Username' name='username' />
          <MyTextInput placeholder='Password' name='password' type='password' />
          <ErrorMessage name='error' render={() =>
            <ValidationError errors={errors.error} />}
          />
          <Button
            loading={isSubmitting}
            positive
            content='Register'
            type='submit' fluid
            disabled={!isValid || !dirty || isSubmitting}
          />
        </Form>
      )}
    </Formik>

  )
})
