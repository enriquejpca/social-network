import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

export default function FindPeople() {
    const [users, setUsers] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    console.log("users", users);

    useEffect(() => {
        fetch("/userss")
            .then((res) => res.json())
            .then((data) => {
                //console.log("Data: ", data);
                setUsers(data);
            })
            .catch((err) => {
                console.log("error getting 3 last users: ", err);
            });
    }, []);

    useEffect(() => {
        let abort = false;
        fetch(`/userss/${searchTerm}`)
            .then((res) => res.json())
            .then((response) => {
                if (!abort) {
                    console.log("Response: ", response);
                    setUsers(response);
                }
            });
        return () => (abort = true);
    }, [searchTerm]);

    return (
        <section className="findpeople-section">
            <div className="findpeople-content">
                <h2>Are you looking for someone in particular?</h2>
                <input
                    placeholder="search"
                    onChange={(e) => setSearchTerm(e.target.value)}
                ></input>
                <div>
                    {!searchTerm && <h3>Recently users: </h3>}
                    {searchTerm && <h3>Search result: </h3>}

                    {users.map((user) => (
                        <div key={user.id}>
                            <Link to={`/users/${user.id}`}>
                                <img
                                    id={user.id}
                                    src={user.profile_photo}
                                    className="photosinfindpeople"
                                ></img>
                                <p>
                                    {user.first} {user.last}
                                </p>
                            </Link>
                        </div>
                    ))}
                </div>

                {/* <h3>
                    <Link to="/">Your profile</Link>{" "}
                </h3> */}
            </div>
        </section>
    );
}
