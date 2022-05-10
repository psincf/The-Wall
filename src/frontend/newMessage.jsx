import React from "react";
import { useState } from "react";
import ReactDOM from "react-dom";

import { useDispatch } from "react-redux";
import { getMessagesFromNetwork } from "./wall.jsx";

import { actions } from"./messagesSlice.jsx";

export function NewMessage(props) {
    const dispatch = useDispatch();
    const [message, setMessage] = useState("");

    function create_message(event) {
        event.preventDefault();
        const updateMessagesFn = () => getMessagesFromNetwork.call(null, dispatch);
        sendMessageToNetwork(message, updateMessagesFn);
    }
    return(
        <form id="new_message">
            insert message here.
            <textarea name="message" placeholder="Insert your message here" maxLength={255} onChange={(e) => setMessage(e.target.value)}></textarea>
            <input type="submit" id="new_message_submit" onClick={create_message} value="Submit"/>
        </form>
    )
}

function sendMessageToNetwork(message, callback) {
    var xhttp = new XMLHttpRequest();
    xhttp.onload = (e) => {
        if (callback) { callback() }
    };
    xhttp.open("POST", "/new_message");
    xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xhttp.send("message=" + message);
}