import { Component } from "react";
import Logo from "./logo";
import ProfilePic from "./profilePic";
import Uploader from "./uploader";
import Profile from "./profile";
import FindPeople from "./findPeople";
import OtherProfile from "./otherProfile";
import FriendsAndWannabees from "./friends-wannabees";
import Chat from "./chat";
import { BrowserRouter, Route } from "react-router-dom";
import { Link } from "react-router-dom";

export default class App extends Component {
    constructor(props) {
        super(props);
        this.state = {};
        this.showUploader = this.showUploader.bind(this);
        this.hideUploader = this.hideUploader.bind(this);
        this.setBio = this.setBio.bind(this);
        this.setProfilePic = this.setProfilePic.bind(this);
        this.setComment = this.setComment.bind(this);
    }
    componentDidMount() {
        fetch("/user")
            .then((res) => res.json())
            .then((data) => {
                console.log("dataaaaaaa: ", data.rows[0]);
                this.setState(data.rows[0]);
            });
    }

    showUploader() {
        this.setState({
            uploaderIsVisible: true,
        });
    }

    hideUploader() {
        this.setState({
            uploaderIsVisible: false,
        });
    }

    setBio(newBio) {
        this.setState({
            bio: newBio,
        });
    }

    setProfilePic(newProfilePic) {
        this.setState({
            profile_photo: newProfilePic,
        });
    }

    setComment(newComment) {
        this.setState({
            comment: newComment,
        });
    }

    render() {
        console.log("State rendered: ", this.state);
        return (
            <>
                <BrowserRouter>
                    <header>
                        <div>
                            <Logo />
                            <ProfilePic
                                first={this.state.first}
                                last={this.state.last}
                                imageUrl={this.state.profile_photo}
                                showUploader={this.showUploader}
                                style="profilePicSmallByDefault"
                            />
                        </div>
                        <div className="header">
                            <h3 className="findpeople-header">
                                <Link to="/users">Find people</Link>{" "}
                            </h3>
                            <h3 className="friends-header">
                                <Link to="/friends-wannabees">Friends</Link>{" "}
                            </h3>
                            <h3 className="chat-header">
                                <Link to="/chat">Chat</Link>{" "}
                            </h3>
                            <h3>
                                <Link to="/">Your profile</Link>{" "}
                            </h3>

                            <h3 className="logout-header">
                                <a href="/logout">Log out</a>
                            </h3>
                        </div>
                    </header>

                    <div>
                        <Route exact path="/">
                            <Profile
                                first={this.state.first}
                                last={this.state.last}
                                imageUrl={this.state.profile_photo}
                                bio={this.state.bio}
                                setBio={this.setBio}
                                comment={this.state.comment}
                                setComment={this.setComment}
                            />
                        </Route>
                        <Route exact path="/users">
                            <FindPeople />
                        </Route>
                        <Route path={"/users/:id"}>
                            <OtherProfile />
                        </Route>
                        <Route exact path={"/friends-wannabees"}>
                            <FriendsAndWannabees />
                        </Route>
                        <Route path="/chat">
                            <Chat />
                        </Route>
                    </div>
                    {this.state.uploaderIsVisible && (
                        <Uploader
                            hideUploader={this.hideUploader}
                            setProfilePic={this.setProfilePic}
                        />
                    )}
                </BrowserRouter>
            </>
        );
    }
}
