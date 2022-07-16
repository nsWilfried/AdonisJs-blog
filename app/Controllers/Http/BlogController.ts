import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Database from '@ioc:Adonis/Lucid/Database'
import Post from 'App/Models/Post'
import moment from 'moment'
import Application from '@ioc:Adonis/Core/Application'
import UpdateValidator from 'App/Validators/UpdateValidator'

export default class BlogController {

    public async index({view, request}: HttpContextContract ) {
        const page = request.input('page', 1)
        const limit = 1
        const posts = await Database.from("posts").paginate(page, limit)
        

        const postsCreatedDates: any = []
        let i =0
        posts.forEach(post =>{
            i++
            if(post.created_at)
                postsCreatedDates.push({
                    index: i,
                    date:moment(post.created_at).fromNow()
                })
        })

        return view.render("blog/index", {
            posts: posts , 
            dates:postsCreatedDates   
        })
    }

    public async loadPosts(){
        return Database.from("posts")
    }

    public async showPost({params, view}:HttpContextContract){
        const post = await Post.findOrFail(params.id)

        return view.render("blog/update", {post})
    }

    public async update({request, response, params}){
        const post = await Post.findOrFail(params.id)
        const cover_image = request.file('cover_image')
    
        const payload = await request.validate(UpdateValidator)

       await  post.merge(payload)
         await post.save()


       if(post.thumbnail != null){
        await cover_image.move(Application.tmpPath('uploads'))
    }
        return response.redirect().toRoute("home")
    }
}


