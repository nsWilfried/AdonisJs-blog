import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class AuthController {


    public async goRegister({view, request}: HttpContextContract){

        const username = request.input('username')
        const password = request.input('password')
        const email = request.input('email')

        return view.render('auth/register')
    }


    public async goLogin({view}: HttpContextContract){

        return view.render('auth/login')
    }
    
    public async register({request}:HttpContextContract) {
        return request.all()
    }
}
