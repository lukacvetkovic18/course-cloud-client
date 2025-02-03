import { useEffect, useState } from "react";
import "../styles"
import { Login, Register } from "../components";

export enum LandingPageState {
    LOGIN,
    REGISTER,
    // PW_RESET
}

export const LandingPage = () => {
    let [pageState, setPageState] = useState<LandingPageState>(LandingPageState.LOGIN);

    useEffect(() => {
        render()
    }, [pageState])

    const render = () => {
        console.log(pageState)
        if(pageState === LandingPageState.LOGIN) {
            return (
                <div>
                    <Login setPageState={setPageState}></Login>
                </div>
            )
        } else if(pageState === LandingPageState.REGISTER) {
            return (
                <div>
                    <Register setPageState={setPageState}></Register>
                </div>
            )
        }
        // else {
        //     return (
        //         <div>
        //             <span>PW RESET</span>
        //         </div>
        //     )
        // }
    }
 
    return (<>
        <div className="landing-page-container">
        <h1>Welcome to CourseCloud</h1>
            {render()}
        </div>
    </>);
}