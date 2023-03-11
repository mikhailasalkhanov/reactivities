/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { observer } from 'mobx-react-lite'
import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { Button, Header, Segment } from 'semantic-ui-react'
import LoadingComponent from '../../../app/layout/LoadingComponent'
import { type Activity } from '../../../app/models/activity'
import { useStore } from '../../../app/strores/store'
import { Formik, Form } from 'formik'
import * as Yup from 'yup'
import MyTextInput from '../../../app/common/form/MyTextInput'
import MyTextArea from '../../../app/common/form/MyTextArea'
import MySelectInput from '../../../app/common/form/MySelectInput'
import { CategoryOptions } from '../../../app/common/options/categoryOptions'
import MyDateInput from '../../../app/common/form/MyDateInput'
import { v4 as uuid } from 'uuid'

export default observer(function ActivityForm () {
  const { activityStore } = useStore()
  const {
    updateActivity, createActivity, loading,
    loadActivity, loadingInitial
  } = activityStore

  const { id } = useParams()

  const navigate = useNavigate()

  const [activity, setActivity] = useState<Activity>({
    id: '',
    title: '',
    category: '',
    description: '',
    date: new Date(),
    city: '',
    venue: ''
  })

  useEffect(() => {
    if (id) loadActivity(id).then(activity => { setActivity(activity!) })
  }, [id, loadActivity])

  function handleFormSubmit (activity: Activity) {
    if (!activity.id) {
      activity.id = uuid()
      createActivity(activity).then(() => { navigate(`/activities/${activity.id}`) })
    } else {
      updateActivity(activity).then(() => { navigate(`/activities/${activity.id}`) })
    }
  }

  if (loadingInitial) return <LoadingComponent content='Loading activity...' />

  const validationSchema = Yup.object({
    title: Yup.string().required('The activity title is required'),
    description: Yup.string().required('The activity description is required'),
    venue: Yup.string().required(),
    category: Yup.string().required(),
    date: Yup.string().required(),
    city: Yup.string().required()
  })

  return (
    <Segment clearing>
      <Header content='Activity Details' sub color='teal' />
      <Formik
        validationSchema={validationSchema}
        enableReinitialize
        initialValues={activity}
        onSubmit={values => { handleFormSubmit(values) }}>
        {({ handleSubmit, isValid, dirty, isSubmitting }) => (
          <Form className='ui form' onSubmit={handleSubmit} autoComplete='off'>
            <MyTextInput name='title' placeholder='title' />
            <MyTextArea rows={3} placeholder='Description' name='description' />
            <MySelectInput options={CategoryOptions} placeholder='Category' name='category' />
            <MyDateInput
              placeholderText='Date'
              name='date'
              showTimeSelect
              timeCaption='time'
              dateFormat='MMMM d, yyyy h:mm aa'
            />
            <Header content='Location Details' sub color='teal' />
            <MyTextInput placeholder='City' name='city' />
            <MyTextInput placeholder='Venue' name='venue' />
            <Button
              disabled={isSubmitting || !dirty || !isValid}
              loading={loading}
              floated='right'
              positive type='submit'
              content='Submit' />
            <Button
              as={Link} to='/activities'
              floated='right'
              positive type='button'
              content='Cancel' />
          </Form>
        )}
      </Formik>

    </Segment>
  )
})
