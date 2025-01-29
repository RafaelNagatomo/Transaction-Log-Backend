import User from "./User"

export default class ActivityLog {
  readonly _id?: string
  readonly event_type: string
  readonly action: string
  readonly old_data: JSON
  readonly new_data: JSON
  readonly changed_by: User
  readonly changed_at: Date
  readonly client_ip: string
  readonly user_agent: object
  readonly createdAt?: Date
  readonly updatedAt?: Date

  constructor({
    event_type,
    action,
    old_data,
    new_data,
    changed_by,
    changed_at,
    client_ip,
    user_agent
  }: ActivityLog) {

    this.event_type = event_type
    this.action = action
    this.old_data = old_data
    this.new_data = new_data
    this.changed_by = changed_by
    this.changed_at = changed_at
    this.client_ip = client_ip
    this.user_agent = user_agent
  }
}
