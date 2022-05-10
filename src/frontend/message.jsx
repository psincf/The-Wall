import React from "react";
import ReactDOM from "react-dom";

import { MessageReaction } from "./message_reaction.jsx";

export function Message(props) {
    const date = new Date();
    date.setTime(props.date);
    return(
        <article className="message">
            <p style={{textAlign:"center"}}>By: {props.author}</p><br />
            {props.message}<br />
            <MessageReaction id={props.id} likes={props.likes} dislikes={props.dislikes} liked={props.liked} disliked={props.disliked}></MessageReaction>
            <p style={{textAlign:"right"}}>{date.toUTCString()}</p>
        </article>
    )
}