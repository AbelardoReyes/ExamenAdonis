import { DateTime } from 'luxon'
import { column, BaseModel } from '@ioc:Adonis/Lucid/Orm'

export default class User extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column({ columnName: 'name', serialize: value => value.charAt(0).toUpperCase() + value.slice(1), consume: value => value.toLowerCase() })
  public name: string

  @column({ columnName: 'ap_paterno', serialize: value => value.charAt(0).toUpperCase() + value.slice(1), consume: value => value.toLowerCase() })
  public ap_paterno: string

  @column({ columnName: 'monitor'})
  public monitor: number
  @column({ columnName: 'password'})
  public password: string

  @column({ columnName: 'email'})
  public email: string

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
