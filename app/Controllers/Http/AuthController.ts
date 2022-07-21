import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import User from 'App/Models/User'
import LoginValidator from 'App/Validators/LoginValidator'
import RegisterValidator from 'App/Validators/RegisterValidator'
export default class AuthController {


    // register
    public async goRegister({view, request, response, bouncer, session}: HttpContextContract){
        if(await this.authorizeAuthentication(bouncer, request)){
            return view.render('auth/register')
       }
       else {
           session.flash("unauthorized", 'Accès refusé: vous êtes déjà connecté')
           response.redirect().toPath('/')
       }
    }

    // go to register page
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

    // log out
    public async logOut({ auth, response}:HttpContextContract){
        await auth.use('web').logout()
        response.clearCookie('user_info')
        response.redirect().toPath('/user/login')
    }

    //login
    public async goLogin({view, session, request, response, bouncer}: HttpContextContract){
        if(await this.authorizeAuthentication(bouncer, request)){
             return view.render('auth/login')
        }
        else {
            session.flash("unauthorized", 'Accès refusé: vous êtes déjà connecté')
            response.redirect().toPath('/')
        }
    }
     
    //login
    public async login({request, auth, session, response}: HttpContextContract)
   {
 
            const email = request.input('email')
            const password = request.input('password')
            let user;
    
            const payload = await request.validate(LoginValidator)
            try {
                await   auth.use('web').attempt(email, password, true).then(data => {
                    const info = data.$original
                    user = {
                        id: info.id, 
                        username: info.username, 
                        email: info.email
                    }
                })
            } catch(error){
    
                const errorCode = error.responseText.split(':')[0]
                if(errorCode == 'E_INVALID_AUTH_UID' ){
                    session.flash("errors.uid", "Cet utilisateur n'existe pas")
                } else if (errorCode  == 'E_INVALID_AUTH_PASSWORD'){
                    session.flash('errors.password', "Mot de passe incorrect")
                }
                return response.redirect().toPath('/user/login')
            }
            response.cookie('user_info', user)
            return  response.redirect().toPath('/')
     
      
   }

    // get authorization to go to an auth page
    public async authorizeAuthentication(bouncer, request){
        const authorization  = await bouncer.with('AuthPolicy').allows('view',  request)
        return authorization
    }
} 

