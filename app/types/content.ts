export interface Content {
  _id?: string
  title: string
  body: string
  author: string
  status: 'draft' | 'published'
  createdAt: string | Date
  updatedAt?: string | Date
}