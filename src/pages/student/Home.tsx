import { useEffect, useState } from "react";
import { Course, User } from "../../utils/models";
import { getLoggedInUser, getAllCourses } from "../../services";
import { Header, Footer, RecommendedCourseCard } from "../../components";
import { useNavigate } from "react-router";
import { getRandomCourses } from "../../services/courseService";

export const Home = () => {
    const navigate = useNavigate();

    useEffect(() => {
        if(localStorage.getItem("token") === null) {
            navigate("/");
        };
        loadUser();
        loadRecommendedCourses();
    }, [])

    let [user, setUser] = useState<User>();
    let [recommendedCourses, setRecommendedCourses] = useState<Course[]>();

    const loadUser = () => {
        getLoggedInUser().then(res => {
            setUser(res.data);
            console.log(user);
        })
    }

    const loadRecommendedCourses = () => {
        getRandomCourses().then(res => {
            setRecommendedCourses(res.data);
            console.log(recommendedCourses);
        })
    }
 
    return (<>
        <Header user={user}></Header>
        <div className="home-container">
            <span className="subtitle">Reccomended courses</span>
            <div className="cards-container">
            {
                recommendedCourses && recommendedCourses.map(course => {
                    return <RecommendedCourseCard course={course}></RecommendedCourseCard>
                })
            }
            </div>
        </div>
        <Footer></Footer>
    </>);
}