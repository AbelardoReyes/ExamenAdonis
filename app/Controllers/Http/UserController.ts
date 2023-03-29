import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { schema, rules } from '@ioc:Adonis/Core/Validator'
import User from 'App/Models/User'
import Hash from '@ioc:Adonis/Core/Hash'

export default class UserController {
    public async register ({ request, response }: HttpContextContract) {
        await request.validate({
            schema: schema.create({
                name: schema.string([
                    rules.maxLength(40),
                ]),
                ap_paterno: schema.string([
                    rules.maxLength(20),
                ]),
                ap_materno: schema.string([
                    rules.maxLength(20),
                ]),
                email: schema.string([
                    rules.email(),
                    rules.unique({ table: 'users', column: 'email' }),
                    rules.trim(),
                ]),
                password: schema.string([
                    rules.minLength(8),
                    rules.maxLength(20),
                    rules.trim(),
                ]),
            }),
            messages: {
                required: 'El campo {{ field }} es obligatorio.',
                maxLength: 'El campo {{ field }} debe tener un máximo de {{ options.maxLength }} caracteres.',
                minLength: 'El campo {{ field }} debe tener un mínimo de {{ options.minLength }} caracteres.',
                email: 'El campo {{ field }} debe ser un correo electrónico válido.',
                unique: 'El campo {{ field }} ya se encuentra en uso.',
                string: 'El campo {{ field }} debe ser una cadena de caracteres.',
                trim: 'El campo {{ field }} no debe contener espacios en blanco.',
            }
        })

        const user = await User.create({
            name: request.input('name'),
            ap_paterno: request.input('ap_paterno'),
            ap_materno: request.input('ap_materno'),
            email: request.input('email'),
            password: await Hash.make(request.input('password')),
        })

        return response.created({
            'status': 201,
            'message': 'Usuario registrado correctamente.',
            'data': user,
            'error': [],
        })
    }

    public async login({ request, response, auth }: HttpContextContract) {
        await request.validate({
            schema: schema.create({
                email: schema.string([
                    rules.email(),
                    rules.trim(),
                ]),
                password: schema.string([
                    rules.minLength(8),
                    rules.maxLength(20),
                    rules.trim(),
                ]),
            }),
            messages: {
                required: 'El campo {{ field }} es obligatorio.',
                string: 'El campo {{ field }} debe ser una cadena de caracteres.',
                trim: 'El campo {{ field }} no debe contener espacios en blanco.',
                email: 'El campo {{ field }} debe ser un correo electrónico válido.',
                minLength: 'El campo {{ field }} debe tener un mínimo de {{ options.minLength }} caracteres.',
                maxLength: 'El campo {{ field }} debe tener un máximo de {{ options.maxLength }} caracteres.',
            }
        })

        const user = await User.query().where('email', request.input('email')).first()

        if (!user) {
            return response.badRequest({
                'status': 400,
                'message': 'No existe ningún usuario con este correo o su cuenta está desactivada.',
                'error': [],
                'data': [],
            })
        }

        if(!await Hash.verify(user.password, request.input('password'))) {
            return response.badRequest({
                'status': 400,
                'message': 'Credenciales de usuario incorrectas.',
                'error': [],
                'data': [],
            })
        }

        const token = await auth.use('api').generate(user)

        return response.ok({
            'status': 200,
            'message': 'Sesión iniciada correctamente.',
            'error': [],
            'data': user,
            'token': token.token,
        })
    }

    public async logout({ auth, response }: HttpContextContract) {
        await auth.use('api').revoke()

        return response.ok({
            'status': 200,
            'message': 'Sesión cerrada correctamente.',
            'error': [],
            'data': [],
        })
    }

    public async getUser({ params, response }) {
        const user = await User.find(params.id)

        if(!user) {
            return response.badRequest({
                'status': 400,
                'message': 'No existe ningún usuario con el id: ' + params.id + '.',
                'error': [],
                'data': [],
            })
        }

        return user
    }

    public async getTokenUser({ auth, response }) {
        const user = await auth.use('api').authenticate()
        
        return response.ok({
            'data': user,
        })
    }
}
