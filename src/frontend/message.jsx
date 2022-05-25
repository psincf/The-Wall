import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";

import { MessageReaction } from "./message_reaction.jsx";
import { NewComment } from "./comment.jsx";
import { Comment } from "./comment.jsx";

export function Message(props) {
    const date = new Date();
    const [commentForm, setCommentForm] = useState(false);
    date.setTime(props.date);

    const [comments, setComments] = useState([]);
    
    useEffect(() => {
        getCommentsFromNetwork(props.id, setComments)
    }, []);
    
    const comments_react = [];
    for (const comment of comments) {
        comments_react.push(
            <Comment key={comment.id} id={comment.id} author={comment.author} message={comment.message} date={comment.date}></Comment>
        )
    }

    return(
        <article className="message">
            <p style={{textAlign:"center"}}>By: {props.author}</p><br />
            {props.message}<br />
            <MessageReaction id={props.id} likes={props.likes} dislikes={props.dislikes} liked={props.liked} disliked={props.disliked}></MessageReaction>
            <p style={{textAlign:"right"}}>{date.toUTCString()}</p>
            <NewComment message_id={props.id}></NewComment>
            {comments_react}
        </article>
    )
}

export function getCommentsFromNetwork(id, setComments) {
    var xhttp = new XMLHttpRequest();
    xhttp.onload = (e) => {
        const messages = xhttp.response;
        if (messages !== "Not ok") {
            const messagesJSON = JSON.parse(messages);
            setComments(messagesJSON);
        }
    };
    xhttp.open("GET", "/get_comments?" + "message_id=" + id, true);
    xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xhttp.send();
}