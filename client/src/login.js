import { Component } from "react";
import { Link } from "react-router-dom";
import Logo from "./logo";

export class Login extends Component {
    constructor() {
        super();
        this.state = {
            error: "",
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }
    componentDidMount() {
        //console.log("Login just mounted");
    }
    handleChange(evt) {
        //console.log("User is typing in the input field");
        //console.log("Which input is my user typing", evt.target.name);
        //console.log("What is the user typing", evt.target.value);
        this.setState(
            {
                [evt.target.name]: evt.target.value,
            },
            () => console.log("Registration state update", this.state)
        );
    }
    handleSubmit(e) {
        //console.log("User wants to send data");
        e.preventDefault();
        console.log("data the user provided", this.state);
        fetch("/login.json", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(this.state),
        })
            .then((resp) => resp.json())
            .then((resp) => {
                console.log("Login was succesfull", resp);
                if (resp.success) {
                    location.replace("/");
                } else {
                    this.setState({ error: resp.message });
                }
            })
            .catch((error) => {
                console.log("err on fetch register.json: ", error);
            });
    }
    render() {
        return (
            <section className="login-section">
                <Logo />
                <h1>LOG IN</h1>
                <form className="form-login">
                    <input
                        name="email"
                        placeholder="email"
                        type="email"
                        onChange={this.handleChange}
                    ></input>
                    <input
                        name="password"
                        placeholder="password"
                        type="password"
                        onChange={this.handleChange}
                    ></input>
                    <button onClick={this.handleSubmit}>Log in</button>
                </form>
                <h3>
                    Click here to come back to
                    <Link to="/"> Registration </Link>{" "}
                </h3>
                <h3>
                    Click here to
                    <Link to="/reset"> reset your password </Link>{" "}
                </h3>
            </section>
        );
    }
}
