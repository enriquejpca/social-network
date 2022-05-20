import { Component } from "react";

export default class Comments extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showCommentsArea: false,
        };
        this.handleComments = this.handleComments.bind(this);
        this.handleCommentsButton = this.handleCommentsButton.bind(this);
        this.submitComment = this.submitComment.bind(this);
    }
    handleComments(evt) {
        console.log("User is typing in the comments area");
        console.log("Where is the user typing: ", evt.target.name);
        console.log("What is the user typing: ", evt.target.value);
        this.setState(
            {
                //[evt.target.name]: evt.target.value
                draftComment: evt.target.value,
            },
            () => console.log("comments state update: ", this.state)
        );
    }
    handleCommentsButton() {
        this.setState({
            showCommentsArea: true,
            draftComment: this.props.comment,
        });
    }
    submitComment(e) {
        e.preventDefault();
        const { draftComment } = this.state;
        fetch("/comment", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ draftComment: draftComment }),
        })
            .then((res) => res.json())
            .then(({ comment }) => {
                this.props.setComment(comment);
                this.setState({
                    showCommentsArea: false,
                });
            })
            .catch((err) => {
                console.log("Error fetching comment: ", err);
            });
    }
    render() {
        console.log("this.state", this.state);
        return (
            <div>
                <div className="comments-container">
                    <p>{this.props.comment}</p>
                </div>
                {!this.state.showCommentsArea && (
                    <div>
                        <p> {this.props.comment} </p>
                        {/* {this.props.comment && (
                            <button onClick={this.handleCommentsButton}>
                                Edit comment
                            </button>
                        )} */}
                        {!this.props.comment && (
                            <button onClick={this.handleCommentsButton}>
                                Add comment
                            </button>
                        )}
                    </div>
                )}
                {this.state.showCommentsArea && (
                    <div>
                        <textarea
                            placeholder="Insert your comment"
                            defaultValue={this.props.comment}
                            onChange={this.handleComments}
                        ></textarea>
                        <button onClick={this.submitComment}>Save</button>
                    </div>
                )}
            </div>
        );
    }
}
