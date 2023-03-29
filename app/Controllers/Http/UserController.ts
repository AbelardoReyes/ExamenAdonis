import { schema, rules } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import User from 'App/Models/User'
import Hash from '@ioc:Adonis/Core/Hash'
import Logger from '@ioc:Adonis/Core/Logger'

export default class UserController {
  public async registrarUsuario({ request }: HttpContextContract) {
    const newPostSchema = schema.create({
      name: schema.string([rules.required()]),
      email: schema.string(),
      password: schema.string(),
      ap_paterno: schema.string(),
    })
    const payload = await request.validate({ schema: newPostSchema })
    if (!payload) {
      return 'Error'
    }
    const user = new User()
    user.name = request.input('name')
    user.email = request.input('email')
    user.password = await Hash.make(request.input('password'))
    user.ap_paterno = request.input('ap_paterno')
    user.monitor = 0
    if (await user.save()) {
      return 'ok'
    }

  }

  public async login({ auth, request, response }) {
    const validarLogin = schema.create({
      email: schema.string(),
      password: schema.string(),
    })
    Logger.info(request.body())
    const email = request.body().email
    const password = request.body().password
    const payload = await request.validate({ schema: validarLogin })


    if (!payload) {
      return response.badRequest('Invalido')
    }
    const user = await User.query().where('email', request.input('email')).first()
    if (!user) {
      return response.badRequest({
        'status': 400,
        'mensaje': 'No existe ningún usuario con este correo o su cuenta está desactivada.',
        'error': [],
        'data': [],
      })
    }

    if (!await Hash.verify(user.password, request.input('password'))) {
      return response.badRequest({
        'status': 400,
        'mensaje': 'Credenciales de usuario incorrectas.',
        'error': [],
        'data': [],
      })
    }
    const token = await auth.use('api').attempt(email, password, {
      expiresIn: '1 days',
    })
    return { 'token': token.token }
  }

  public async logout({ auth, response, params }) {
    await auth.use('api').revoke()


    return response.ok({ 'status': 200, 'mensaje': 'Sesión cerrada correctamente.', 'error': [], 'data': [] })
  }

  public async infoUserObjeto({ auth }) {
    const user = await auth.authenticate()
    const infoUser = await User.query().where('id', user.id).first()
    return infoUser
  }

  public async infoUser({ auth, response }) {
    if (auth.user) {
      const user = await auth.authenticate()
      const infoUser = await User.query().where('id', user.id).first()
      return infoUser
    } else {
      return response.badRequest({
        'status': 401,
        'mensaje': 'No existe ningún usuario con este correo o su cuenta está desactivada.',
        'error': [],
        'data': [],
      })
    }
  }

  public async infoUsuario({ }) {
    const user = await User.all()
    return user
  }

  public async validarToken({ auth }) {
    if (auth.user) {
      return true
    } else {
      return false
    }
  }

  public async infoIDUser({ params }) {
    const user = await User.findOrFail(params.id)
    return user
  }



}
