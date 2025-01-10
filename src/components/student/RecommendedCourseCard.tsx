import example from "../../assets/example-button-speech-bubble-example-colorful-web-banner-illustration-vector.jpg"

export const RecommendedCourseCard = ({course}: any) => {
    return (<>
        <div className="card-container">
            <img src={example}></img>
            <h3>{ course.title }</h3>
            <span className="author">By Luka Cvetkovic</span>
            <span className="description">{ course.description }</span>
        </div>
    </>);
}