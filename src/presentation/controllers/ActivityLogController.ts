import { Request, Response } from 'express'
import FindAllLogsUseCase from "~/application/activityLog/FindAllLogsUseCase"
import LogActionUseCase from "~/application/activityLog/LogActionUseCase"

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
    const getAllTransactions = await this.findAllLogsUseCase.execute()
    res.status(200).json(getAllTransactions)
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
  }
}
