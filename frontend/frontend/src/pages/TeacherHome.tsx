import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { logoutUser } from "../api/auth";
import { fetchTeacherProfile } from "../api/profile"; // Import the function to fetch teacher profile

const TeacherHome = () => {
  const [teacherProfile, setTeacherProfile] = useState<any>(null);
  const [offeredCourses, setOfferedCourses] = useState<any[]>([]);
  const [newCourseName, setNewCourseName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  // Extract user details from local storage
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const token = user.token;
  const teacherId = user.id;

  // Fetch teacher profile
  useEffect(() => {
    if (token && teacherId) {
      const fetchProfile = async () => {
        const response = await fetchTeacherProfile(teacherId, token);
        if (response.error) {
          setError(response.error);
        } else {
          setTeacherProfile(response);
        }
      };
      fetchProfile();
    }
  }, [token, teacherId]);

  // Fetch courses offered by teacher
  useEffect(() => {
    if (teacherId) {
      axios
        .get(`http://localhost:6898/api/courses-offered/${teacherId}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => setOfferedCourses(res.data))
        .catch((err) => setError("Failed to load offered courses"));
    }
  }, [teacherId]);

  // Create a new course
  const createCourse = async () => {
    if (!newCourseName.trim()) return alert("Please enter a course name!");

    try {
      await axios.post(
        "http://localhost:6898/teacher/createCourse",
        { name: newCourseName },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setNewCourseName("");
      // Refresh courses after adding
      const updatedCourses = await axios.get(
        `http://localhost:6898/api/courses-offered/${teacherId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setOfferedCourses(updatedCourses.data);
    } catch (error) {
      setError("Failed to create course");
    }
  };

  // Delete a course
  const deleteCourse = async (courseId: number) => {
    try {
      await axios.delete(
        `http://localhost:6898/api/courses/${courseId}/teacher/${teacherId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      // Update state after deletion
      setOfferedCourses(offeredCourses.filter((course) => course.id !== courseId));
    } catch (error) {
      setError("Failed to delete course");
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
      <h2>Welcome, Teacher!</h2>

      {/* Teacher Profile Section */}
      {teacherProfile ? (
        <div>
          <h3>Profile Details:</h3>
          <p><strong>Name:</strong> {teacherProfile.name}</p>
          <p><strong>Address:</strong> {teacherProfile.address}</p>
          <p><strong>Phone No:</strong> {teacherProfile.phoneNo}</p>
        </div>
      ) : (
        <p>Loading profile...</p>
      )}

      {/* Create Course Section */}
      <h3>Create a New Course</h3>
      <input
        type="text"
        placeholder="Enter course name"
        value={newCourseName}
        onChange={(e) => setNewCourseName(e.target.value)}
      />
      <button onClick={createCourse}>Create Course</button>

      {/* Offered Courses Table */}
      <h3>Courses Offered</h3>
      {offeredCourses.length > 0 ? (
        <table border={1} style={{ width: "100%", marginTop: "20px" }}>
          <thead>
            <tr>
              <th>Course ID</th>
              <th>Course Name</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {offeredCourses.map((course) => (
              <tr key={course.id}>
                <td>{course.id}</td>
                <td>{course.courseName}</td>
                <td>
                  <button
                    onClick={() => deleteCourse(course.id)}
                    style={{
                      color: "white",
                      backgroundColor: "red",
                      border: "none",
                      padding: "5px 10px",
                      cursor: "pointer",
                    }}
                  >
                    🗑 Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No courses offered yet.</p>
      )}

      <button onClick={handleLogout}>Logout</button>
    </div>
  );
};

export default TeacherHome;
