import React from "react";
import { useState } from "react";
import ReactDOM from "react-dom";
import { useSelector } from "react-redux";

export function MessageReaction(props) {
    const username = useSelector((state) => state.user.value);
    const [upvoteCount, setUpvoteCount] = useState(props.likes || 0);
    const [upvoted, setUpvoted] = useState(props.liked || false);
    const [downvoteCount, setDownvoteCount] = useState(props.dislikes || 0);
    const [downvoted, setDownvoted] = useState(props.disliked || false);

    const upvote = () => {
        if (username === null) { return }
        sendMessageLike(props.id, !upvoted)
        var num = 1;
        if (upvoted) { num = -1; }
        setUpvoted(!upvoted);
        setUpvoteCount(upvoteCount + num);
        if (downvoted) { downvote() }
    };
    
    const downvote = () => {
        if (username === null) { return }
        sendMessageDislike(props.id, !downvoted)
        var num = 1;
        if (downvoted) { num = -1; }
        setDownvoted(!downvoted);
        setDownvoteCount(downvoteCount + num);
        if (upvoted) { upvote() }
    };

    var upvoted_style = {};
    var downvoted_style = {};

    if (upvoted) { upvoted_style = { backgroundColor: "grey" } }
    if (downvoted) { downvoted_style = { backgroundColor: "grey" } }

    return(
        <p>
            <button className="reaction_button" style={upvoted_style} onClick={() => upvote()}>&#x1F44D; {upvoteCount}</button>
            <button className="reaction_button" style={downvoted_style} onClick={() => downvote()}>&#x1F44E; {downvoteCount}</button>
        </p>
    )
}

function sendMessageLike(message_id, set, callback) {
    var xhttp = new XMLHttpRequest();
    xhttp.onload = (e) => {
        if (callback) { callback() }
    };
    xhttp.open("POST", "/like_message");
    xhttp.setRequestHeader("Content-type", "application/json");
    xhttp.send(JSON.stringify({message_id: message_id, set: set}));
}

function sendMessageDislike(message_id, set, callback) {
    var xhttp = new XMLHttpRequest();
    xhttp.onload = (e) => {
        if (callback) { callback() }
    };
    xhttp.open("POST", "/dislike_message");
    xhttp.setRequestHeader("Content-type", "application/json");
    xhttp.send(JSON.stringify({message_id: message_id, set: set}));
}