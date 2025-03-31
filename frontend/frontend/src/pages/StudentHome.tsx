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
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      {/* Top Right Logout Button */}
      <div style={{ display: "flex", justifyContent: "flex-end" }}>
        <button onClick={handleLogout} style={{ padding: "8px 15px", backgroundColor: "#f44336", color: "white", border: "none", borderRadius: "4px", cursor: "pointer" }}>
          Logout
        </button>
      </div>

      {/* Profile Section */}
      <div style={{ display: "flex", alignItems: "center", marginTop: "20px", borderBottom: "1px solid #ddd", paddingBottom: "20px" }}>
        <div style={{ width: "100px", height: "100px", borderRadius: "50%", backgroundColor: "#e0e0e0", marginRight: "20px", display: "flex", justifyContent: "center", alignItems: "center" }}>
          {/* Placeholder for Profile Picture */}
          <span style={{ fontSize: "2em" }}>👤</span>
        </div>
        <div>
          {studentProfile ? (
            <div>
              <h2>{studentProfile.name}</h2>
              <p><strong>Address:</strong> {studentProfile.address}</p>
            </div>
          ) : (
            <p>Loading profile...</p>
          )}
        </div>
      </div>

      {/* Courses List */}
      <div style={{ marginTop: "20px" }}>
        <h3>Registered Courses</h3>
        {courses.length > 0 ? (
          <table style={{ width: "100%", borderCollapse: "collapse", marginTop: "10px" }}>
            <thead>
              <tr style={{ backgroundColor: "#f2f2f2" }}>
                <th style={{ padding: "10px", textAlign: "left" }}>Course ID</th>
                <th style={{ padding: "10px", textAlign: "left" }}>Course Name</th>
                <th style={{ padding: "10px", textAlign: "left" }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {courses.map((course) => (
                <tr key={course.id} style={{ borderBottom: "1px solid #ddd" }}>
                  <td style={{ padding: "10px" }}>{course.id}</td>
                  <td style={{ padding: "10px" }}>{course.courseName}</td>
                  <td style={{ padding: "10px" }}>
                    <button onClick={() => handleDropCourse(course.id)} style={{ backgroundColor: "#f44336", color: "white", border: "none", padding: "8px 12px", borderRadius: "4px", cursor: "pointer" }}>
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
      </div>

      {/* Modal Button */}
      <button onClick={handleOpenModal} style={{ marginTop: "20px", padding: "10px 20px", backgroundColor: "#2196f3", color: "white", border: "none", borderRadius: "4px", cursor: "pointer" }}>
        📚 Register for a Course
      </button>

      {/* Modal */}
      {showModal && (
        <div style={{ position: "fixed", top: "50%", left: "50%", transform: "translate(-50%, -50%)", backgroundColor: "white", padding: "20px", boxShadow: "0px 0px 10px rgba(0,0,0,0.1)", borderRadius: "8px", zIndex: "1000" }}>
          <h3>Available Courses</h3>
          <table style={{ width: "100%", borderCollapse: "collapse", marginTop: "10px" }}>
            <thead>
              <tr style={{ backgroundColor: "#f2f2f2" }}>
                <th style={{ padding: "10px", textAlign: "left" }}>Course ID</th>
                <th style={{ padding: "10px", textAlign: "left" }}>Course Name</th>
                <th style={{ padding: "10px", textAlign: "left" }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {allCourses.map((course) => (
                <tr key={course.id} style={{ borderBottom: "1px solid #ddd" }}>
                  <td style={{ padding: "10px" }}>{course.id}</td>
                  <td style={{ padding: "10px" }}>{course.name}</td>
                  <td style={{ padding: "10px" }}>
                    <button onClick={() => handleEnrollCourse(course.id)} style={{ backgroundColor: "#4caf50", color: "white", border: "none", padding: "8px 12px", borderRadius: "4px", cursor: "pointer" }}>
                      ➕ Add
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <button onClick={() => setShowModal(false)} style={{ marginTop: "20px", padding: "10px 20px", backgroundColor: "gray", color: "white", border: "none", borderRadius: "4px", cursor: "pointer" }}>
            ❌ Close
          </button>
        </div>
      )}
    </div>
  );
};

export default StudentHome;