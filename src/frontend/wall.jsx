import React from "react";
import ReactDOM from "react-dom";

import { Message } from "./message.jsx"
import { NewMessage } from "./newMessage.jsx"

import { actions } from"./messagesSlice.jsx";
import { useSelector, useDispatch } from "react-redux";

export function Wall(props) {
    const dispatch = useDispatch();

    getMessagesFromNetwork(dispatch);

    return(
        <main>
            <NewMessage></NewMessage>
            <div id="list_messages">
                <ListMessages></ListMessages>
            </div>
        </main>
    )
}

function ListMessages() {
    const messagesState = useSelector((state) => state.messages.value)
    const messages = [];
    for (let message of messagesState) {
        messages.push(
            <Message author={message.author} key={message.id} id={message.id} message={message.message} date={message.date} likes={message.likes} dislikes={message.dislikes} liked={message.liked} disliked={message.disliked}></Message>
        );
    }
    return(
        <>
            {messages}
        </>
    )
}

export function getMessagesFromNetwork(dispatch) {
    var xhttp = new XMLHttpRequest();
    xhttp.onload = (e) => {
        const messages = xhttp.response;
        const messagesJSON = JSON.parse(messages);
        dispatch(actions.add_messages(messagesJSON));
    };
    xhttp.open("GET", "/get_messages", true);
    xhttp.send();
}