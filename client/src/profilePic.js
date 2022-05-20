export default function ProfilePic(props) {
    //console.log("From profilePic: ", props);
    return (
        <img
            className={props.style}
            alt={`${props.first} ${props.last}`}
            src={props.imageUrl || "/profilePicByDefault.jpg"}
            onClick={props.showUploader}
        ></img>
    );
}
