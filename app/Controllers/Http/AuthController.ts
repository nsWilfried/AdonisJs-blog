import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import User from 'App/Models/User'
import RegisterValidator from 'App/Validators/RegisterValidator'
export default class AuthController {


    public async goRegister({view, request, response}: HttpContextContract){
        return view.render('auth/register')
    }

    public async register({request, response, auth}: HttpContextContract){

        // retrieve all user inputs
        const username = request.input('username')
        const password = request.input('password')
        const email = request.input('email')
        const rememberMeToken = request.input('remember')
        const remember = false ? rememberMeToken == undefined : true

        // validate all users input data
        const payload = await request.validate(RegisterValidator)
        const user = await User.create(payload)

        //login user
        await auth.use('web').attempt(email,password, remember)

        // save user info in cookie
        if(remember == false)
        {
            response.cookie("user_info", user)
        }else {
            response.cookie("user_info", user, {
                maxAge: '1y'
            })
        }
        response.redirect().toPath('/')
    }

    public async logOut({ auth, request, response}:HttpContextContract){
        await auth.use('web').logout()
        response.clearCookie('user_info')
        response.redirect().toPath('/user/login')
    }
    public async goLogin({view}: HttpContextContract){

        return view.render('auth/login')
    }
   
}
