import { useDispatch } from "react-redux";
import { reactionAdded } from "./postsSlice";
import { AiFillLike } from "react-icons/ai";
import { FcLike } from "react-icons/fc";
import { BsEmojiSurprise } from "react-icons/bs";
import { FaEye } from "react-icons/fa";
import { FaShare } from "react-icons/fa";
const reactionEmoji = {
    // thumbsUp: '👍',
    // wow: '😮',
    // heart: '❤️',
    // rocket: '🚀',
    // coffee: '☕'
	 thumbsUp: <AiFillLike style={{color:'yellow'}}/>,
    wow: <BsEmojiSurprise style={{color:'yellow'}}/>,
    heart: <FcLike/>,
    rocket: <FaShare style={{color:'white'}}/>,
    coffee: <FaEye />
}

const ReactionButtons=({post})=>{
  const dispatch=useDispatch()
	const reactionButtons=Object.entries(reactionEmoji).map(([name,emoji])=>{
		return (
			<button key={name} type="button" className="reactionButton" onClick={()=>dispatch(reactionAdded({postId:post.id,reaction:name}))}>
           {emoji}{post.reactions[name]}
			</button>
		)
	})

	return <div>{reactionButtons}</div>
}
export default ReactionButtons;