import mongoose from "mongoose"

mongoose.plugin((schema) => {
  schema.pre("save", function (next) {
    const now = new Date().toLocaleString("en-US", { timeZone: "America/Sao_Paulo" })
    this.set({
      createdAt: convertToBrazilTime(now),
      updatedAt: convertToBrazilTime(now),
      changedAt: convertToBrazilTime(now)
    })
    next()
  })

  schema.pre("findOneAndUpdate", function (next) {
    const now = new Date().toLocaleString("en-US", { timeZone: "America/Sao_Paulo" })
    this.set({ updatedAt: convertToBrazilTime(now) })
    next()
  })
})

function convertToBrazilTime(dateStr: string): Date {
  const date = new Date(dateStr)
  return new Date(date.getTime() - date.getTimezoneOffset() * 60000)
}
