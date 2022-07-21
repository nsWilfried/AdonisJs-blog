import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Post from 'App/Models/Post'
import moment from 'moment'
import Application from '@ioc:Adonis/Core/Application'
import UpdateValidator from 'App/Validators/UpdateValidator'
import User from 'App/Models/User'
import CreatePostValidator from 'App/Validators/CreatePostValidator'
moment.locale('fr')

export default class BlogController {

    public async index({view, request}: HttpContextContract ) {
        const page = request.input('page', 1)
        const limit = 3
        const userCookie = request.cookie('user_info')
        let postsCreatedDates: any = []
        let user;

        const posts = await Post.query().preload("user").paginate(page, limit)

    
        posts.forEach(post =>{
            if(post.$original.createdAt.ts != null)
                postsCreatedDates.push({
                    index: post.id,
                    date:moment(post.$original.createdAt.ts).fromNow()
                })
        })
     
        if(userCookie != undefined &&  userCookie != null ){
             user = userCookie
        } else {
            user = null 
        }

        return view.render("blog/index", {
            posts: posts , 
            dates:postsCreatedDates, 
            auth:  user
        })
    }

    public async loadPosts(){
        return await Post.query().preload('user')
    }

    public async loadUsers(){
        return await User.query()
    }

    public async getOnePost({view, params}:HttpContextContract){
        const post = await Post.findOrFail(params.id)
        return view.render('blog/post', {post})
    }

    public async createPostPage({view}:HttpContextContract){
        return view.render('blog/edit')
    }

    public getInputs(request){
        const title = request.input('title')
        const description = request.input('description')
        const thumbnail = request.file('cover_image') 
        const content  = request.input('content')
        const user_id = request.cookie('user_info').id
        return {title, description, thumbnail, content, user_id}
    }

    public async createPost({request, response}:HttpContextContract){
         
        const  inputs = this.getInputs(request)
         
        const payload = await request.validate(CreatePostValidator)
         await Post.create({
            title: inputs.title, 
            description: inputs.description, 
            thumbnail:  inputs.thumbnail?.clientName, 
            content: inputs.content,  
            userId: inputs.user_id
         })

         if (inputs.thumbnail) {
            await inputs.thumbnail.move(Application.tmpPath('uploads'))
          }

          response.redirect().toPath('/')

        
    }
    public async showPost({params, view, bouncer, response, session, request}:HttpContextContract){
        const post = await Post.findOrFail(params.id)
        const authorization = await bouncer.with('UpdatePostPolicy').allows('view', post, request)
        if(authorization){
            return view.render("blog/update", {post})

        } else {
            session.flash('unauthorized', "Vous n'êtes pas autorisé à accéder à cette ressource")
            response.redirect().toPath('/')
        }
    }

    public async update({request, response, params}:HttpContextContract){

        const post = await Post.findOrFail(params.id)
        
        const inputs = this.getInputs(request)
        const payload = await request.validate(UpdateValidator)

       await  post.merge({
           title: inputs.title, 
           description: inputs.description, 
           thumbnail: inputs.thumbnail.clientName
       })
        await post.save()


       if(inputs.thumbnail != null){
        await inputs.thumbnail.move(Application.tmpPath('uploads'))
    }
        return response.redirect().toRoute("home")
    }
}


