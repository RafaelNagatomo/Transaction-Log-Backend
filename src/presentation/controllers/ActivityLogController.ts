import { Request, Response } from 'express'
import FindAllLogsUseCase from "../../application/activityLog/FindAllLogsUseCase"
import LogActionUseCase from "../../application/activityLog/LogActionUseCase"

export default class ActivityLogController {
    private findAllLogsUseCase: FindAllLogsUseCase
    private logActionUseCase: LogActionUseCase

  constructor (
    findAllLogsUseCase: FindAllLogsUseCase,
    logActionUseCase: LogActionUseCase,
  ) {
    this.findAllLogsUseCase = findAllLogsUseCase
    this.logActionUseCase = logActionUseCase
  }

  async getAll(req: Request, res: Response): Promise<void> {
    const filters = {
      changedBy: req.query.changedBy
        ? req.query.changedBy as string
        : undefined,
      action: req.query.action as string,
      startDate: req.query.startDate
        ? new Date(req.query.startDate as string).toISOString()
        : undefined,
      endDate: req.query.endDate
        ? new Date(req.query.endDate as string).toISOString()
        : undefined,
      userAgent: req.query.userAgent as string,
    }

    try {
      const getAllLogs = await this.findAllLogsUseCase.execute(filters)
      res.status(200).json(getAllLogs)
    } catch (error:any) {
      res.status(400).json({ error: error.message })
    }
  }

  async create(req: Request, res: Response): Promise<void> {
    const {
      eventType,
      action,
      oldData,
      newData,
      changedBy,
      changedAt,
      clientIp,
      userAgent
    } = req.body

    try {
      const newActivityLog = await this.logActionUseCase.execute({
        eventType,
        action,
        oldData,
        newData,
        changedBy,
        changedAt,
        clientIp,
        userAgent
      })
      res.status(201).json(newActivityLog)
    } catch (error:any) {
      res.status(400).json({ error: error.message })
    }
  }
}
