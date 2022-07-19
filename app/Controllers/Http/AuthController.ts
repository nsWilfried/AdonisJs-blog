import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import User from 'App/Models/User'
import RegisterValidator from 'App/Validators/RegisterValidator'
export default class AuthController {


    public async goRegister({view, request, response}: HttpContextContract){
        return view.render('auth/register')
    }

    public async register({request, response, auth}: HttpContextContract){

        const username = request.input('username')
        const password = request.input('password')
        const email = request.input('email')

        const payload = await request.validate(RegisterValidator)
        const user = await User.create(payload)
        await auth.login(user)
        response.cookie("user_info", user)
        response.redirect().toPath('/')
    }

    public async logOut({view, auth, response}:HttpContextContract){
        await auth.use('web').logout()
        response.redirect().toPath('/user/login')
    }
    public async goLogin({view}: HttpContextContract){

        return view.render('auth/login')
    }
   
}
