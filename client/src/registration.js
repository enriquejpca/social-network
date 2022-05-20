import { Component } from "react";
import { Link } from "react-router-dom";
import Logo from "./logo";

export class Registration extends Component {
    constructor() {
        super();
        this.state = {
            error: "",
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }
    componentDidMount() {
        console.log("Registration just mounted");
    }
    handleChange(evt) {
        //console.log("evt: ", evt); //Y en la consolda del browser se ve el tipo de evento que es.
        //console.log("User is typing in the input field");
        //console.log("which input field is my user typing in: ", evt.target.name);
        //console.log("What is the user typing: ", evt.target.value);
        //Every time a change on any of the imput fields happens we want to see to synch that change to our state.
        this.setState(
            {
                [evt.target.name]: evt.target.value,
            },
            () => console.log("Registration state update", this.state)
        );
    }
    handleSubmit(e) {
        //console.log("User wants to send over data to the server & register");
        e.preventDefault();
        console.log("data the user provided: ", this.state);
        fetch("/register.json", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(this.state),
        })
            .then((resp) => resp.json())
            .then(
                (resp) => {
                    console.log("Registration was succesfull", resp);
                    if (resp.success) {
                        location.reload();
                    } else {
                        this.setState({ error: resp.message });
                    }
                }
                //Still to do in the client
                //If the server indicates registration failed, render erro condition.
                //if the server indicates that registration was succesful.
                //trigger page reload with location.reload() in order of rerunning.
                //start.js
            )
            .catch((error) => {
                console.log("err on fetch register.json: ", error);
            });
    }
    render() {
        return (
            <section className="registration-section">
                <Logo />
                <h1>REGISTRATION</h1>
                {this.state.error && <h2>{this.state.error}</h2>}
                <form className="form-registration">
                    <input
                        name="first"
                        placeholder="First Name"
                        type="text"
                        onChange={this.handleChange}
                    ></input>
                    <input
                        name="last"
                        placeholder="Last Name"
                        type="text"
                        onChange={this.handleChange}
                    ></input>
                    <input
                        name="email"
                        placeholder="Email"
                        type="email"
                        onChange={this.handleChange}
                    ></input>
                    <input
                        name="password"
                        placeholder="Password"
                        type="password"
                        onChange={this.handleChange}
                    ></input>
                    <button onClick={this.handleSubmit}>Register</button>
                </form>
                <h3>
                    Click here to <Link to="/login">Log in!</Link>{" "}
                </h3>
            </section>
        );
    }
}
