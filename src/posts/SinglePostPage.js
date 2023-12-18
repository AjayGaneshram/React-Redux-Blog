import React from 'react'
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectPostById } from './postsSlice'
import PostUser from "./user/PostUser";
import TimeAgo from "./TimeAgo";
import ReactionButtons from "./ReactionButtons";
import { useParams } from 'react-router-dom';


const SinglePostPage = () => {
	const { postId } = useParams()
	const post = useSelector((state) => selectPostById(state, Number(postId)))

	if (!post) {
		return (
			<section>
				<h2>post Not found</h2>
			</section>)
	}
	return (
		<article >
			<h3>{post.title}</h3>
			<p>{post.body}</p>
			<p className="postCredit">
				<Link to={`/post/edit/${post.id}`}>Edit Post</Link>
				<PostUser userId={post.userId} />
				<TimeAgo timeStamp={post.date} />

			</p>
			<ReactionButtons post={post} />
		</article>
	)
}

export default SinglePostPage
