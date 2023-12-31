import { createSlice } from "@reduxjs/toolkit";
import { nanoid, createAsyncThunk,createSelector } from "@reduxjs/toolkit"
import  axios  from "axios";
import { sub } from "date-fns";
// const initialState = [
// 	{
// 		id: '1',
// 		title: 'Redux ToolKit',
// 		content: 'Easy to Learn',
// 		date: sub(new Date(), { minutes: 10 }).toISOString(),
// 		reactions: {
// 			thumbsUp: 0,
// 			wow: 0,
// 			heart: 0,
// 			rocket: 0,
// 			coffee: 0
// 		}
// 	},
// 	{

// 		id: '2',
// 		title: 'Redux Redux',
// 		content: 'Easy to Learn',
// 		date: sub(new Date(), { minutes: 5 }).toISOString(),
// 		reactions: {
// 			thumbsUp: 0,
// 			wow: 0,
// 			heart: 0,
// 			rocket: 0,
// 			coffee: 0
// 		}
// 	}
// ]


const POSTS_URL = 'https://jsonplaceholder.typicode.com/posts';


const initialState = {
	posts: [],
	status: 'idle',
	error: null
}

export const fetchPosts = createAsyncThunk('posts/fetchPosts', async () => {
	const response = await axios.get(POSTS_URL)
	return response.data;
})

export const addNewPost = createAsyncThunk('posts/addNewPost', async (initialState) => {
	const response = await axios.post(POSTS_URL,initialState)
	return response.data;
})
export const updatePost = createAsyncThunk('posts/updatePost', async (initialPost) => {
    const { id } = initialPost;
    try {
        const response = await axios.put(`${POSTS_URL}/${id}`, initialPost)
        return response.data
    } catch (err) {
        //return err.message;
        return initialPost; // only for testing Redux!
    }
})

export const deletePost = createAsyncThunk('posts/deletePost', async (initialPost) => {
    const { id } = initialPost;
    try {
        const response = await axios.delete(`${POSTS_URL}/${id}`)
        if (response?.status === 200) return initialPost;
        return `${response?.status}: ${response?.statusText}`;
    } catch (err) {
        return err.message;
    }
})


export const postSlice = createSlice({
	name: 'posts',
	initialState,
	reducers: {
		postAdded: {
			reducer(state, action) {
				// state.push(action.payload)

				state.posts.push(action.payload)
			},
			prepare(title, content, userId) {
				return {
					payload: {
						id: nanoid(),
						title,
						content,
						date: new Date().toISOString(),
						userId,
                        reactions: {
                            thumbsUp: 0,
                            wow: 0,
                            heart: 0,
                            rocket: 0,
                            coffee: 0
                        }

					}
				}
			}

		},
		reactionAdded(state, action) {
			const { postId, reaction } = action.payload;

			// const existingPost=state.find(post=> post.id ===postId)
			const existingPost = state.posts.find(post => post.id === postId)
			if (existingPost) {
				existingPost.reactions[reaction]++;
			}
		}
	}, extraReducers(builder) {
		builder
			.addCase(fetchPosts.pending, (state, action) => {
				state.status = 'loading'
			})
			.addCase(fetchPosts.fulfilled, (state, action) => {
				state.status = 'succeeded'
				//Adding data and reactions
				let min = 1;
				const loadedPosts = action.payload.map(post => {
					post.date = sub(new Date(), { minutes: min++ }).toISOString()
					post.reactions = {
						thumbsUp: 0,
						wow: 0,
						heart: 0,
						rocket: 0,
						coffee: 0
					}
					return post;
				});
			
				state.posts=state.posts.concat(loadedPosts)
			})
			.addCase(fetchPosts.rejected, (state, action) => {
				state.status = 'failed'
				state.error=action.error.message
			})
			.addCase(addNewPost.fulfilled, (state, action) => {
                // Fix for API post IDs:
                // Creating sortedPosts & assigning the id 
                // would be not be needed if the fake API 
                // returned accurate new post IDs
                const sortedPosts = state.posts.sort((a, b) => {
                    if (a.id > b.id) return 1
                    if (a.id < b.id) return -1
                    return 0
                })
                action.payload.id = sortedPosts[sortedPosts.length - 1].id + 1;
                // End fix for fake API post IDs 

                action.payload.userId = Number(action.payload.userId)
                action.payload.date = new Date().toISOString();
                action.payload.reactions = {
                    thumbsUp: 0,
						wow: 0,
						heart: 0,
						rocket: 0,
						coffee: 0
                }
                state.posts.push(action.payload)
            })
			.addCase(updatePost.fulfilled, (state, action) => {
                if (!action.payload?.id) {
                    console.log('Update could not complete')
                    console.log(action.payload)
                    return;
                }
                const { id } = action.payload;
                action.payload.date = new Date().toISOString();
                const posts = state.posts.filter(post => post.id !== id);
                state.posts = [...posts, action.payload];
            })
            .addCase(deletePost.fulfilled, (state, action) => {
                if (!action.payload?.id) {
                    console.log('Delete could not complete')
                    console.log(action.payload)
                    return;
                }
                const { id } = action.payload;
                const posts = state.posts.filter(post => post.id !== id);
                state.posts = posts;
            })

	}
})
// export const selectAllPosts = (state) => state.posts;
export const selectAllPosts = (state) => state.posts.posts;
export const gerPostsStatus=(state)=>state.posts.status
export const gerPostsError=(state)=>state.posts.error
export const selectPostById=(state,postId)=>state.posts.posts.find(post =>post.id===postId)
export const selectPostsByUser = createSelector(
    [selectAllPosts, (state, userId) => userId],
    (posts, userId) => posts.filter(post => post.userId === userId)
)
export const { postAdded, reactionAdded } = postSlice.actions
export default postSlice.reducer;


