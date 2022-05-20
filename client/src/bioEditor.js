import { Component } from "react";

export default class BioEditor extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showTextArea: false,
        };
        this.handleBioChange = this.handleBioChange.bind(this);
        this.handleBioButton = this.handleBioButton.bind(this);
        this.submitBio = this.submitBio.bind(this);
    }

    handleBioChange(evt) {
        //console.log("User is typing in the bio area");
        //console.log("Which input is typing the user: ", evt.target.name);
        //console.log("What is typing the user: ", evt.target.value);
        this.setState(
            {
                //[evt.target.name]: evt.target.value,
                draftBio: evt.target.value,
            },
            () => console.log("Bio state update: ", this.state)
        );

        // in here, you want to keep track of the draft bio that the user types
        // store whatever that value is in bioEditor's state as the 'draftBio'
    }

    handleBioButton() {
        this.setState({ showTextArea: true, draftBio: this.props.bio });
    }

    submitBio(e) {
        e.preventDefault();
        const { draftBio } = this.state;

        fetch("/bio", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ draftBio: draftBio }),
        })
            .then((resp) => resp.json())
            .then(({ bio }) => {
                this.props.setBio(bio);
                this.setState({
                    showTextArea: false,
                });
            })
            .catch((err) => {
                console.log("Error: ", err);
            });
    }

    render() {
        console.log("this.state", this.state);
        return (
            <div>
                {!this.state.showTextArea && (
                    <div>
                        <p> {this.props.bio} </p>
                        {this.props.bio && (
                            <button onClick={this.handleBioButton}>Edit</button>
                        )}
                        {!this.props.bio && (
                            <button onClick={this.handleBioButton}>
                                Add Bio
                            </button>
                        )}
                    </div>
                )}
                {this.state.showTextArea && (
                    <div className="bio-content">
                        <textarea
                            className="textAreaBio"
                            defaultValue={this.props.bio}
                            onChange={this.handleBioChange}
                        ></textarea>
                        <button onClick={this.submitBio} className="bio-button">
                            Save
                        </button>
                    </div>
                )}
            </div>
        );
    }
}
