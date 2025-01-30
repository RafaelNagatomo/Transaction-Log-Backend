import { model, Schema } from "mongoose"
import ActivityLog from "~/domain/entities/ActivityLog"

const ActivityLogSchema = new Schema<ActivityLog>(
  {
    eventType: { type: String, enum: ['Transaction', 'User'], required: true },
    action: { type: String, required: true },
    oldData: { type: Schema.Types.Mixed },
    newData: { type: Schema.Types.Mixed },
    changedBy: { type: Object, required: true },
    changedAt: { type: Date, required: true },
    clientIp: { type: String },
    userAgent: { type: Object },
  }
)

const ActivityLogModel = model<ActivityLog>('ActivityLog', ActivityLogSchema)

export default ActivityLogModel
