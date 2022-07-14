import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class ContactController {
    public async index({view}:HttpContextContract){
        return view.render('contact/contact')
    }
}
