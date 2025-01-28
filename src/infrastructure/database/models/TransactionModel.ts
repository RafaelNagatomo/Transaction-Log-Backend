import { Schema, model } from 'mongoose'
import Transaction from '~/domain/entities/Transaction'

const TransactionSchema = new Schema<Transaction>(
  {
    type: { type: String, enum: ['income', 'outcome'], required: true },
    amount: { type: Number, required: true},
    description: { type: String, required: true },
    status: { type: String, enum: ['paid', 'pending'], required: true },
    isActive: { type: Boolean, required: true },
  },
  { timestamps: true }
)

const TransactionModel = model<Transaction>('Transaction', TransactionSchema)

export default TransactionModel
