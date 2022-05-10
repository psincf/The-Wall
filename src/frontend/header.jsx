import React from "react";
import ReactDOM from "react-dom";

import { actions as actionsUser } from "./usersSlice.jsx";
import { useSelector, useDispatch } from "react-redux";

import { LogPopup } from "./logPopup.jsx";

export function Header(props) {
    const username = useSelector((state) => state.user.value);
    const dispatch = useDispatch();

    askUsername(dispatch);
    return(
        <div id="header">
            <div id="top_page_left"></div>
            <h1 id="title">The wall</h1>
            <ConnectButton username={username}></ConnectButton>
        </div>
    )
}

function ConnectButton(props) {
    const dispatch = useDispatch();
    if (props.username) {
        return (
            <p id="top_page_user">
                {props.username}
                <button onClick={() => logout(dispatch)}>Disconnect</button>
            </p>
        )
    } else {
        return (
            <>
                <p id="top_page_user">
                    Guest user
                    <button onClick={() => displayPopup()}>Connect</button>
                </p>
                <LogPopup></LogPopup>
            </>
        )
    }
}

function displayPopup(dispatch) {
    if (document.getElementById("log_popup").style.visibility == "visible") {
        document.getElementById("log_popup").style.visibility = "hidden"
    } else {
        document.getElementById("log_popup").style.visibility = "visible"
    }
}

function logout(dispatch) {
    var xhttp = new XMLHttpRequest();
    xhttp.onload = (e) => {
        askUsername(dispatch);
        window.location.reload();
    };
    xhttp.open("POST", "/logout");
    //xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xhttp.send();
}

export function askUsername(dispatch) {
    var xhttp = new XMLHttpRequest();
    xhttp.onload = (e) => {
        if (xhttp.response != "false") {
            dispatch(actionsUser.set_user(xhttp.response));
        }
    };
    xhttp.open("GET", "/get_username");
    //xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xhttp.send();
}