import { action } from '@ioc:Adonis/Addons/Bouncer';
import { BasePolicy } from '@ioc:Adonis/Addons/Bouncer'
import Post from 'App/Models/Post';
import User from 'App/Models/User';

export default class UpdatePostPolicy extends BasePolicy {

    @action({ allowGuest: true })
    public async view(user:User, post:Post,  request){
        if(request.cookie('user_info').id == post.userId){
            return true
        } else {
            return false
        }
    }
}
