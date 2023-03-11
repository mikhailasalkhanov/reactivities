/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { makeAutoObservable, runInAction } from 'mobx'
import agent from '../api/agent'
import { type Activity } from '../models/activity'
import { v4 as uuid } from 'uuid'

export default class ActivityStore {
  activityRegistry = new Map<string, Activity>()
  selectedActivity: Activity | undefined = undefined
  editMode = false
  loading = false
  loadingInitial = false

  constructor () {
    makeAutoObservable(this)
  }

  get activitiesByDate () {
    return Array.from(this.activityRegistry.values()).sort(
      (a, b) => a.date!.getTime() - b.date!.getTime()
    )
  }

  get groupedActivities () {
    return Object.entries(
      this.activitiesByDate.reduce<Record<string, Activity[]>>((activities, activity) => {
        const date = activity.date!.toISOString().split('T')[0]
        activities[date.toString()] = activities[date.toString()]
          ? [...activities[date.toString()], activity]
          : [activity]
        return activities
      }, {})
    )
  }

  loadActivities = async () => {
    this.setLoadingInitial(true)
    try {
      const activities = await agent.Activities.list()
      activities.forEach((acttivity) => {
        this.setActivity(acttivity)
      })
      this.setLoadingInitial(false)
    } catch (error) {
      console.log(error)
      this.setLoadingInitial(false)
    }
  }

  loadActivity = async (id: string) => {
    let activity = this.getActivity(id)
    if (activity != null) {
      this.selectedActivity = activity
      return activity
    } else {
      this.setLoadingInitial(true)
      try {
        activity = await agent.Activities.details(id)
        this.setActivity(activity)
        runInAction(() => (this.selectedActivity = activity))
        this.setLoadingInitial(false)
        return activity
      } catch (error) {
        console.log(error)
        this.setLoadingInitial(false)
      }
    }
  }

  private readonly setActivity = (activity: Activity) => {
    activity.date = new Date(activity.date!)
    this.activityRegistry.set(activity.id, activity)
  }

  private readonly getActivity = (id: string) => {
    return this.activityRegistry.get(id)
  }

  setLoadingInitial = (state: boolean) => {
    this.loadingInitial = state
  }

  createActivity = async (activity: Activity) => {
    this.loading = true
    activity.id = uuid()
    try {
      await agent.Activities.create(activity)
      runInAction(() => {
        this.activityRegistry.set(activity.id, activity)
        this.selectedActivity = activity
        this.editMode = false
        this.loading = false
      })
    } catch (error) {
      console.log(error)
      runInAction(() => {
        this.loading = false
      })
    }
  }

  updateActivity = async (activity: Activity) => {
    this.loading = true
    try {
      await agent.Activities.update(activity)
      runInAction(() => {
        this.activityRegistry.set(activity.id, activity)
        this.selectedActivity = activity
        this.editMode = false
        this.loading = false
      })
    } catch (error) {
      console.log(error)
      runInAction(() => {
        this.loading = false
      })
    }
  }

  deleteActivity = async (id: string) => {
    this.loading = true
    try {
      await agent.Activities.delete(id)
      runInAction(() => {
        this.activityRegistry.delete(id)
        this.loading = false
      })
    } catch (error) {
      console.log(error)
      runInAction(() => {
        this.loading = false
      })
    }
  }
}
