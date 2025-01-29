import { model, Schema } from "mongoose"
import ActivityLog from "~/domain/entities/ActivityLog"

const ActivityLogSchema = new Schema<ActivityLog>(
  {
    event_type: { type: String, enum: ['Transaction', 'User'], required: true },
    action: { type: String, required: true },
    old_data: { type: Schema.Types.Mixed },
    new_data: { type: Schema.Types.Mixed, required: true },
    changed_by: { type: Object, required: true },
    changed_at: { type: Date, required: true },
    client_ip: { type: String },
    user_agent: { type: Object },
  }
)

const ActivityLogModel = model<ActivityLog>('ActivityLog', ActivityLogSchema)

export default ActivityLogModel
