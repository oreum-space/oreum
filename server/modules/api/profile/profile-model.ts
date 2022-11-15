import { model, Schema, Document, Types  } from 'mongoose'

export interface IProfile extends Document {
  username: string, usernames: Array<{ value: string, created: Date, removed: Date }>,
  email: string,  emails: Array<{ value: string, created: Date, removed: Date }>,
  password: string, passwords: Array<{ value: string, created: Date, removed: Date }>,

  activation?: {
    link: string,
    code: string,
    hash: string,
    left: number
  },

  permission: number,
  currency: number,

  avatar?: string, avatars?: Array<string>,
  skin?: string, skins?: Array<string>,
  badge?: string, badges?: Array<string>,
  server?: Types.ObjectId, servers?: Array<Types.ObjectId>,

  created: Date,
  updated: Date,
  visited: Date,
  online: boolean,

  tokens: Array<Types.ObjectId>
  integrations: {
    discord?: string,
    google?: string
  }
}

const required = true, unique = true

const ProfileSchema = new Schema<IProfile>({
  username: { type: String, unique, required },
  usernames: {
    type: [
      {
        type: {
          value: { type: String, required },
          created: { type: Date, required },
          removed: { type: Date, required }
        }
      }
    ], default: () => []
  },
  email: { type: String, unique, required },
  emails: {
    type: [
      {
        type: {
          value: { type: String, required },
          created: { type: Date, required },
          removed: { type: Date, required }
        }
      }
    ], default: () => []
  },
  password: { type: String, required },
  passwords: {
    type: [
      {
        type: {
          value: { type: String, required },
          created: { type: Date, required },
          removed: { type: Date, required }
        }
      }
    ], default: () => []
  },

  activation: {
    type: {
      link: { type: String, required },
      code: { type: String, required },
      hash: { type: String, required },
      left: { type: Number, default: 0 }
    }
  },

  permission: { type: Number, default: 0 },
  currency: { type: Number, default: 0 },

  avatar: { type: String },
  avatars: { type: [String], default: () => [] },
  skin: { type: String },
  skins: { type: [String], default: () => [] },
  badge: { type: String },
  badges: { type: [String], default: () => [] },
  server: { type: Schema.Types.ObjectId },
  servers: { type: [Schema.Types.ObjectId], default: () => [] },

  created: { type: Date, default: () => new Date() },
  updated: { type: Date, default: () => new Date() },
  visited: { type: Date, default: () => new Date() },
  online: { type: Boolean, default: () => false },

  tokens: { type: [Schema.Types.ObjectId], default: () => [] },
  integrations: {
    type: {
      discord: { type: String },
      google: { type: String }
    }
  }
})

export default model<IProfile>('User', ProfileSchema)