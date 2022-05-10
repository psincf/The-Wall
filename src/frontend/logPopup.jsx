import React, { useState } from "react";
import ReactDOM from "react-dom";

import { actions as actionsUser } from "./usersSlice.jsx";
import { useSelector, useDispatch } from "react-redux";

import { askUsername } from "./header.jsx";

const LOGIN = 0;
const SIGNUP = 1;

export function LogPopup(props) {
    const username = useSelector((state) => state.user.value);
    const dispatch = useDispatch();

    const [formUsername, setFormUsername] = useState("");
    const [formPassword, setFormPassword] = useState("");
    const [logType, setLogType] = useState(LOGIN);

    var logTypeString;
    if (logType === LOGIN) { logTypeString = "Login" }
    else { logTypeString = "Sign Up" }

    const form_action = (e, dispatch) => {
        e.preventDefault();
        if (logType === LOGIN) { login(e, dispatch); }
        else { signup(e, dispatch); }
    };

    const login = (e, dispatch) => {
        const fd = new FormData(e.target);
        var xhttp = new XMLHttpRequest();
        xhttp.onload = (_) => {
            askUsername(dispatch);
            window.location.reload();
        };
        xhttp.open("POST", "/login");
        xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        xhttp.send("username="+formUsername+"&password="+formPassword);
    }
    
    const signup = (e, dispatch) => {
        const fd = new FormData(e.target);
        var xhttp = new XMLHttpRequest();
        xhttp.onload = (_) => {
            if (xhttp.response === "false") {}
            else if (xhttp.response === "true") {
                login(e, dispatch);
            }
        };
        xhttp.open("POST", "/signup");
        xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        xhttp.send("username="+formUsername+"&password="+formPassword);
    }

    return(
        <div id="log_popup">
            <button className="form_type" onClick={() => setLogType(LOGIN)}>Login</button>
            <button className="form_type" onClick={() => setLogType(SIGNUP)}>Sign up</button>
            <form id="connect_form" onSubmit={(e) => form_action(e, dispatch)}>
                <input type="text" id="username" name="username" placeholder="username" value={formUsername} onChange={(e) => setFormUsername(e.target.value)} /><br/>
                <input type="password" id="password" name="password" placeholder="password" value={formPassword} onChange={(e) => setFormPassword(e.target.value)} /><br/>
                <input type="submit" id="form_submit" className="special_button" value={logTypeString}/><br/>
            </form>
        </div>
    )
}