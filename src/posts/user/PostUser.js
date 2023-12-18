import { useSelector } from "react-redux";
import { selectAllUser } from "./userSlice";
const PostUser =({userId})=>{
   
	const users=useSelector(selectAllUser);
	const author=users.find(user=>user.id===userId)

	return <span>by {author?author.name:'unKnown Author'}</span>
}

export default PostUser;