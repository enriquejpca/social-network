import { useState, useEffect } from "react";
import { useParams, useHistory } from "react-router-dom";
import { Link } from "react-router-dom";

import FriendButton from "./friendButton";

export default function OtherProfile() {
    const [user, setUser] = useState({});
    const params = useParams();
    const history = useHistory();
    console.log("params ", params);
    console.log("history: ", history);

    useEffect(() => {
        fetch(`/userss/profile/${params.id}`)
            .then((res) => res.json())
            .then((data) => {
                console.log("response helooooooooo: ", data);
                if (data.sucess) {
                    history.replace("/");
                } else {
                    setUser(data[0]);
                    console.log(data);
                }
            });
    }, []);

    if (!user.id) {
        return <div></div>;
    }

    return (
        <section>
            <div className="otherprofile-section">
                <h1>
                    This is the Profile of {user.first} {user.last}
                </h1>
                <img
                    id={user.id}
                    src={user.profile_photo || "/profilePicByDefault.jpg"}
                    className="otherprofiles-photos"
                ></img>
                <p>{user.bio}</p>
                <FriendButton otherUserId={user.id} />
                {/* <h3>
                    <Link to="/">Your profile</Link>{" "}
                </h3> */}
            </div>
        </section>
    );
}
