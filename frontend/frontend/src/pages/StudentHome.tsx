import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { logoutUser } from "../api/auth";
import { fetchStudentProfile, fetchRegisteredCourses, dropCourse, fetchAllCourses, enrollCourse } from "../api/profile";

const StudentHome = () => {
  const [studentProfile, setStudentProfile] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [courses, setCourses] = useState<any[]>([]); // Registered courses
  const [allCourses, setAllCourses] = useState<any[]>([]); // All available courses
  const [showModal, setShowModal] = useState(false); // Modal visibility
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const { token, id } = user;

  useEffect(() => {
    if (token && id) {
      const fetchProfileData = async () => {
        const profileResponse = await fetchStudentProfile(Number(id), token);
        if (profileResponse.error) {
          setError(profileResponse.error);
        } else {
          setStudentProfile(profileResponse);
        }

        const coursesResponse = await fetchRegisteredCourses(Number(id), token);
        if (coursesResponse.error) {
          setError(coursesResponse.error);
        } else {
          setCourses(coursesResponse);
        }
      };

      fetchProfileData();
    }
  }, [token, id]);

  // Fetch all courses when opening the modal
  const handleOpenModal = async () => {
    try {
      const coursesResponse = await fetchAllCourses(token);
      if (coursesResponse.error) {
        setError(coursesResponse.error);
      } else {
        setAllCourses(coursesResponse);
        setShowModal(true);
      }
    } catch (error) {
      console.error("Error fetching courses:", error);
    }
  };

  // Handle course enrollment
  const handleEnrollCourse = async (courseId: number) => {
    try {
      const response = await enrollCourse(courseId, token);
  
      if (response.error) {
        setError(response.error);
      } else {
        // Ensure courses update correctly after enrollment
        setCourses([...courses, { id: courseId, courseName: allCourses.find(c => c.id === courseId)?.name }]);
        setShowModal(false); // Close modal after enrolling
      }
    } catch (error) {
      console.error("Error enrolling in course:", error);
    }
  };

  // Handle dropping a course
  const handleDropCourse = async (courseId: number) => {
    try {
      const response = await dropCourse(Number(id), courseId, token);
      if (response.error) {
        setError(response.error);
      } else {
        setCourses(courses.filter(course => course.id !== courseId));
      }
    } catch (error) {
      console.error("Error dropping course:", error);
    }
  };

  const handleLogout = () => {
    logoutUser();
    navigate("/login");
  };

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div>
      <h2>Welcome, Student!</h2>
      {studentProfile ? (
        <div>
          <h3>Profile Details:</h3>
          <p><strong>Name:</strong> {studentProfile.name}</p>
          <p><strong>Address:</strong> {studentProfile.address}</p>
        </div>
      ) : (
        <p>Loading profile...</p>
      )}

      {/* Registered Courses Table */}
      <h3>Registered Courses:</h3>
      {courses.length > 0 ? (
        <table border={1} style={{ width: "100%", marginTop: "20px" }}>
          <thead>
            <tr>
              <th>Course ID</th>
              <th>Course Name</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {courses.map(course => (
              <tr key={course.id}>
                <td>{course.id}</td>
                <td>{course.courseName}</td>
                <td>
                  <button
                    onClick={() => handleDropCourse(course.id)}
                    style={{
                      color: "white",
                      backgroundColor: "red",
                      border: "none",
                      padding: "5px 10px",
                      cursor: "pointer",
                    }}
                  >
                    🗑️ Drop
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No registered courses found.</p>
      )}

      {/* Button to open modal */}
      <button onClick={handleOpenModal} style={{ marginTop: "20px", padding: "10px", backgroundColor: "blue", color: "white", border: "none", cursor: "pointer" }}>
        📚 Register for a Course
      </button>

      {/* Modal for course selection */}
      {showModal && (
        <div style={{
          position: "fixed", top: "50%", left: "50%", transform: "translate(-50%, -50%)",
          backgroundColor: "black", padding: "20px", boxShadow: "0px 0px 10px rgba(0,0,0,0.1)", borderRadius: "8px"
        }}>
          <h3>Available Courses</h3>
          <table border={1} style={{ width: "100%", marginTop: "10px" }}>
            <thead>
              <tr>
                <th>Course ID</th>
                <th>Course Name</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {allCourses.map(course => (
                <tr key={course.id}>
                  <td>{course.id}</td>
                  <td>{course.name}</td>
                  <td>
                    <button
                      onClick={() => handleEnrollCourse(course.id)}
                      style={{
                        color: "white",
                        backgroundColor: "green",
                        border: "none",
                        padding: "5px 10px",
                        cursor: "pointer",
                      }}
                    >
                      ➕ Add
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <button onClick={() => setShowModal(false)} style={{ marginTop: "20px", padding: "10px", backgroundColor: "gray", color: "white", border: "none", cursor: "pointer" }}>
            ❌ Close
          </button>
        </div>
      )}

      <button onClick={handleLogout} style={{ marginTop: "20px" }}>Logout</button>
    </div>
  );
};

export default StudentHome;
