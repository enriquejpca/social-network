import { Component } from "react";

export default class Uploader extends Component {
    constructor(props) {
        super(props);
        this.state = {};

        this.handleClick = this.handleClick.bind(this);
    }

    handleClick(e) {
        e.preventDefault();
        const file = this.state.file;
        console.log(this.state.file);
        let fd = new FormData();
        fd.append("file", file);
        fetch("/upload", {
            method: "POST",
            body: fd,
        })
            .then((res) => res.json())
            .then((response) => {
                console.log("res", response);
                this.props.setProfilePic(response[0].profile_photo);
                this.props.hideUploader();
            })
            .catch((err) => {
                console.log("err", err);
            });
    }

    render() {
        return (
            <>
                <section className="modal">
                    <form className="modalContent">
                        <h1
                            onClick={this.props.hideUploader}
                            className="close-modal"
                        >
                            X
                        </h1>
                        <h2>Do you want to change your image?</h2>
                        <input
                            className="inputmodal"
                            type="file"
                            accept="image/*"
                            onChange={(e) => {
                                console.log(e.target.files[0]);
                                this.setState({ file: e.target.files[0] });
                            }}
                        ></input>
                        <button onClick={this.handleClick}> Submit</button>
                    </form>
                </section>
            </>
        );
    }
}
