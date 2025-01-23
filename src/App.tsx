import './App.css'
import { AllCourses, AllInstructors, CreateCourse, Home, InstructorProfile, LandingPage, MyCourses, MyProfile } from './pages'
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import SearchResults from './pages/SearchResults';
import { ViewCourse } from './pages/ViewCourse';

function App() {
	return (
		<>
			<Router>
				<Routes>
					<Route path="/" element={<LandingPage />}/>
					<Route path="/home" element={<Home />}/>
					<Route path="/my-courses" element={<MyCourses />}/>
					<Route path="/my-profile" element={<MyProfile />}/>
					<Route path="/courses" element={<AllCourses />}/>
					<Route path="/instructors" element={<AllInstructors />}/>
					<Route path="/instructors/:slug" element={<InstructorProfile />} />
					<Route path="/courses/create" element={<CreateCourse />} />
					<Route path="/courses/:slug" element={<ViewCourse />} />
                    <Route path="/search-results" element={<SearchResults />} />
				</Routes>
			</Router>
		</>
	);
}

export default App
