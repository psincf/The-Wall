import React from "react";
import ReactDOM from "react-dom";

import { Header } from "./header.jsx";
import { Wall } from "./wall.jsx";

import { store } from"./store.jsx";

import { Provider } from "react-redux";

export function App(props) {
    return(
        <Provider store={store}>
            <Header></Header>
            <Wall messages={props.messages}></Wall>
        </Provider>
    );
}