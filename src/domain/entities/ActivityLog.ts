import User from "./User"

export default class ActivityLog {
  readonly _id?: string
  readonly eventType: string
  readonly action: string
  readonly oldData: JSON
  readonly newData: JSON
  readonly changedBy: User
  readonly changedAt: Date
  readonly clientIp: string
  readonly userAgent: object
  readonly createdAt?: Date
  readonly updatedAt?: Date

  constructor({
    eventType,
    action,
    oldData,
    newData,
    changedBy,
    changedAt,
    clientIp,
    userAgent
  }: ActivityLog) {

    this.eventType = eventType
    this.action = action
    this.oldData = oldData
    this.newData = newData
    this.changedBy = changedBy
    this.changedAt = changedAt
    this.clientIp = clientIp
    this.userAgent = userAgent
  }
}
