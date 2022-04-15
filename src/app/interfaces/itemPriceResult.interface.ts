export interface ItemPriceResult {
  slug: String,
  itemId: Number,
  name: String,
  uniqueName: String,
  timerange: Number,
  data: ItemData[]
}

export interface ItemData {
  marketValue: number,
  minBuyout: number,
  quantity: number,
  scannedAt: Date,
}