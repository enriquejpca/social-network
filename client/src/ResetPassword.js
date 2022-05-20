import { Component } from "react";
import { Link } from "react-router-dom";
import Logo from "./logo";

export class ResetPassword extends Component {
    constructor() {
        super();
        this.state = {
            step: 1,
            error: false,
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleSubmitVerify = this.handleSubmitVerify.bind(this);
    }
    componentDidMount() {
        console.log("ResetPassword just mounted");
    }
    handleChange(evt) {
        console.log("User is typing in the input field");
        console.log("Which input is my user typing", evt.target.name);
        console.log("What is the user typing", evt.target.value);
        this.setState(
            {
                [evt.target.name]: evt.target.value,
            },
            () => console.log("Insert email state: ", this.state)
        );
    }
    handleSubmit(e) {
        console.log("User wants to send the email");
        e.preventDefault();
        console.log("data the user provided", this.state);
        fetch("/reset/start", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(this.state),
        })
            .then((resp) => resp.json())
            .then((resp) => {
                console.log(resp);
                if (resp.success) {
                    this.setState({ step: 2 });
                } else {
                    this.setState({ step: 1 });
                    this.setState({ error: true });
                }
            })
            .catch((err) => {
                console.log(err);
                this.setState({ error: true });
            });
    }

    handleSubmitVerify(e) {
        console.log("User wants to send the new password");
        e.preventDefault();
        console.log("Data the user provided", this.state);
        fetch("/reset/verify", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(this.state),
        })
            .then((resp) => resp.json())
            .then((resp) => {
                console.log(resp);
                if (resp.success) {
                    this.setState({ step: 3 });
                } else {
                    this.setState({ step: 2 });
                    this.setState({ error: true });
                }
            })
            .catch((err) => {
                console.log(err);
                this.setState({ error: true });
            });
    }

    getCurrentDisplay() {
        const step = this.state.step;
        if (step == 1) {
            return (
                <section className="resetpassword-section">
                    <Logo />
                    <h1>RESET PASSWORD</h1>
                    <h3>
                        Please enter the email adress with which you registered
                    </h3>
                    <input
                        name="email"
                        placeholder="email"
                        //type="email"
                        onChange={this.handleChange}
                    ></input>
                    <button onClick={this.handleSubmit}>Submit</button>
                </section>
            );
        } else if (step == 2) {
            return (
                <section className="resetpassword-section">
                    <Logo />
                    <h2>RESET PASSWORD</h2>
                    <h3>Please enter the code you received</h3>
                    <input
                        name="code"
                        placeholder="code"
                        type="code"
                        onChange={this.handleChange}
                    ></input>
                    <h3>Please enter a new password</h3>
                    <input
                        name="password"
                        placeholder="password"
                        type="password"
                        onChange={this.handleChange}
                    ></input>
                    <button onClick={this.handleSubmitVerify}>Submit</button>
                </section>
            );
        } else if (step == 3) {
            return (
                <section className="resetpassword-section">
                    <Logo />
                    <h2>RESET PASSWORD:</h2>
                    <h2>Success!</h2>
                    <h3>
                        You can now <Link to="/login">log in</Link> with your
                        new password
                    </h3>
                </section>
            );
        }
    }
    render() {
        return <div>{this.getCurrentDisplay()}</div>;
    }
}
