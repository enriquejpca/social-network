import ProfilePic from "./profilePic";
import BioEditor from "./bioEditor";
//import Comments from "./comments";

export default function Profile(props) {
    //console.log("Props in profile: ", props);
    return (
        <div className="profile-container">
            <h2>
                {props.first} {props.last}
            </h2>
            <ProfilePic
                first={props.first}
                last={props.last}
                imageUrl={props.imageUrl}
                style="profilePicByDefault"
            />
            <BioEditor bio={props.bio} setBio={props.setBio} />
        </div>
    );
}
