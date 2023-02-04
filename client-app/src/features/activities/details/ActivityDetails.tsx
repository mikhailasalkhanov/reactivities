import React from 'react';
import { Button, Card, Image } from 'semantic-ui-react';
import LoadingComponent from '../../../app/layout/LoadingComponent';
import { useStore } from '../../../app/strores/store';

export default function ActivityDetails() {

  const { activityStore } = useStore();
  const { selectedActivity: activity, openForm, cancelSelectedActivity: cancelActivity } = activityStore;

  if (!activity) return <LoadingComponent />;

  return (
    <Card fluid>
      <Image src={`/assets/categoryImages/${activity.category}.jpg`} />
      <Card.Content>
        <Card.Header>{activity.title}</Card.Header>
        <Card.Meta>
          <span>{activity.date}</span>
        </Card.Meta>
        <Card.Description>
          {activity.description}
        </Card.Description>
      </Card.Content>
      <Card.Content extra>
        <Button.Group width='2'>
          <Button
            onClick={() => openForm(activity.id)}
            basic color='blue'
            content='Edit' />
          <Button
            onClick={cancelActivity}
            basic
            color='green'
            content='Cancel' />
        </Button.Group>
      </Card.Content>
    </Card>
  )
}