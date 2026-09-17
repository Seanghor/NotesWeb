export default class ApiURL {
  /* Autehntication Module */
  static LOGIN = '/auth/login'
  static REGISTER = '/auth/register'

  /* Notes Module */
  static GET_ALL_NOTE = '/notes/list'
  static GET_ONE_NOTE = '/notes/getByID'
  static CREATE_NOTE = '/notes/create'
  static UPDATE_NOTE = '/notes/updateByID'
  static DELETE_NOTE = '/notes/deleteByID'
}
