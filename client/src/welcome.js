//Below we are importing something not exported as default.

import { Registration } from "./registration";
import { Login } from "./login";
import { ResetPassword } from "./ResetPassword";
import { BrowserRouter, Route } from "react-router-dom";

export default function Welcome() {
    return (
        <>
            <h1 className="welcome-message">WELCOME TO MY SOCIAL NETWORK</h1>

            <BrowserRouter>
                <div>
                    <Route exact path="/">
                        <Registration />
                    </Route>
                    <Route path="/login">
                        <Login />
                    </Route>
                    <Route path="/reset">
                        <ResetPassword />
                    </Route>
                </div>
            </BrowserRouter>
        </>
    );
}
