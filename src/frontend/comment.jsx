import React from "react";
import ReactDOM from "react-dom";
import { useState } from "react";

import { MessageReaction } from "./message_reaction.jsx";

export function Comment(props) {
    const date = new Date();
    date.setTime(props.date);

    //const message_reaction = <MessageReaction id={props.id} likes={props.likes} dislikes={props.dislikes} liked={props.liked} disliked={props.disliked}></MessageReaction>;
    const message_reaction = <></>;

    return(
        <article className="comment">
            <p style={{textAlign:"center"}}>By: {props.author}</p><br />
            {props.message}<br />
            {message_reaction}
            <p style={{textAlign:"right"}}>{date.toUTCString()}</p>
        </article>
    )
}

export function NewComment(props) {
    const [message, setMessage] = useState("");

    function create_message(event) {
        event.preventDefault();
        sendCommentToNetwork(message, props.message_id);
    }

    return(
        <form id="new_comment">
            <textarea name="message" placeholder="Insert your comment here" maxLength={255} onChange={(e) => setMessage(e.target.value)}></textarea>
            <input type="submit" id="new_comment_submit" onClick={create_message} value="Comment"/>
        </form>
    )
}


function sendCommentToNetwork(message, message_id, callback) {
    var xhttp = new XMLHttpRequest();
    xhttp.onload = (e) => {
        if (callback) { callback() }
        else { window.location.reload() }
    };
    xhttp.open("POST", "/comment_message");
    xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xhttp.send("message=" + message + "&message_id=" + message_id);
}