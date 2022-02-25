import Post from "../model/post.js"

export const postValidation = async (request, response, next) => {
    const { postId } = request.body
    const post = await Post.findById(postId)

    if (!post) {
        return response.status(404).json({ error: "The post requested does not exist!" })
    }

    request.post = post

    return next()
}