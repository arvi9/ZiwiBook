import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import moment from "moment";
// Styles
import "./index.css";
import { addCommentReply, deleteComment, updateComment } from "../../app/features/post/postSlice";
import CommentForm from "./CommentForm";

const Comment = ({ comment,CurrentUserId }) => {
  const [activeComment,setActiveComment]=useState(null)
  const dispatch = useDispatch();
  const id = activeComment?.id

  // checking if the user is allowed to Reply,Edit or Delete 
  const canReply = Boolean(CurrentUserId);
  const canEdit = CurrentUserId === comment?.owner?._id || comment?.owner;
  const canDelete = CurrentUserId === comment?.owner?._id  || comment?.owner ;

  // conditions to know what exactly the User willing to do 
  const isReplying = activeComment && activeComment.type ==="replying" && activeComment.id === comment._id ;
  const isEditing = activeComment && activeComment.type ==="editing" && activeComment.id === comment._id ;

  //comment old text field 
const oldText = useSelector((state)=>state.post.comments.find(comment=>comment._id ===id))

  //onsubmitHandler
  const addComment = (text) => {
  if (activeComment.type === "replying" ) {
     dispatch(addCommentReply({id, text }));
     setActiveComment(null)
   } else{
    dispatch(updateComment({id,text}) )
    setActiveComment(null)
   }
  };

  return (
    <div className="comment">
      <img className="comment-image" src={comment?.owner?.image} alt="." />
      <div className="comment-body">
        <div className="comment-info">
          <span className="comment-author">{comment?.owner?.name}</span>
          <span className="date">{moment(comment?.createdAt).fromNow()}</span>
        </div>
       {!isEditing && <p className="comment-text">{comment?.text}</p>}
       {isEditing && (
        <CommentForm  submitLabel="update"  handleSubmit={addComment} oldText={oldText.text} />
       )}
        <div className="comment-actions">
          {canReply && <div className="comment-action"onClick={()=>setActiveComment({id:comment?._id,type:"replying"})}>Reply</div>}
          {canEdit && <div className="comment-action" onClick={()=>setActiveComment({id:comment?._id,type:"editing"})}>Edit</div>}
          {canDelete && <div className="comment-action" onClick={()=>dispatch(deleteComment(comment?._id ))}>Delete</div>}
          {isReplying && (
            <CommentForm 
            submitLabel="Reply"
            handleSubmit={addComment}/>
          )}
        </div>

        {comment.replies && (
          <div className="replies">
            {comment.replies.map((reply, i) => (
              <Comment comment={reply} key={i} replies={[]} CurrentUserId={CurrentUserId}/>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Comment;
