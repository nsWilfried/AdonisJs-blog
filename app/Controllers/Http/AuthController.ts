import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class AuthController {


    public async goRegister({view}: HttpContextContract){

        return view.render('auth/register')
    }


    public async goLogin({view}: HttpContextContract){

        return view.render('auth/login')
    }
    
    public async register({request}:HttpContextContract) {
        return request.all()
    }
}
