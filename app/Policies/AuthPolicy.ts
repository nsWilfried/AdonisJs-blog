import { action } from '@ioc:Adonis/Addons/Bouncer'
import { BasePolicy } from '@ioc:Adonis/Addons/Bouncer'
import User from 'App/Models/User'

export default class AuthPolicy extends BasePolicy {

    @action({ allowGuest: true })
    public async view(user:User, request){
        if(request.cookie('user_info') != undefined){
            return false
        } else {
            return true
        }
    }
}
