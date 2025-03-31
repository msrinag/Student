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
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      {/* Top Right Logout Button */}
      <div style={{ display: "flex", justifyContent: "flex-end" }}>
        <button onClick={handleLogout} style={{ padding: "8px 15px", backgroundColor: "#f44336", color: "white", border: "none", borderRadius: "4px", cursor: "pointer" }}>
          Logout
        </button>
      </div>

      {/* Teacher Profile Section */}
      <div style={{ display: "flex", alignItems: "center", marginTop: "20px", borderBottom: "1px solid #ddd", paddingBottom: "20px" }}>
        <div style={{ width: "100px", height: "100px", borderRadius: "50%", backgroundColor: "#e0e0e0", marginRight: "20px", display: "flex", justifyContent: "center", alignItems: "center" }}>
          <span style={{ fontSize: "2em" }}>🧑‍🏫</span>
        </div>
        <div>
          {teacherProfile ? (
            <div>
              <h2>{teacherProfile.name}</h2>
              <p><strong>Address:</strong> {teacherProfile.address}</p>
              <p><strong>Phone No:</strong> {teacherProfile.phoneNo}</p>
            </div>
          ) : (
            <p>Loading profile...</p>
          )}
        </div>
      </div>

      {/* Create Course Section */}
      <div style={{ marginTop: "20px" }}>
        <h3>Create a New Course</h3>
        <input
          type="text"
          placeholder="Enter course name"
          value={newCourseName}
          onChange={(e) => setNewCourseName(e.target.value)}
          style={{ padding: "8px", marginRight: "10px", border: "1px solid #ddd", borderRadius: "4px" }}
        />
        <button onClick={createCourse} style={{ padding: "8px 15px", backgroundColor: "#4caf50", color: "white", border: "none", borderRadius: "4px", cursor: "pointer" }}>
          Create Course
        </button>
      </div>

      {/* Offered Courses Table */}
      <div style={{ marginTop: "20px" }}>
        <h3>Courses Offered</h3>
        {offeredCourses.length > 0 ? (
          <table style={{ width: "100%", borderCollapse: "collapse", marginTop: "10px" }}>
            <thead>
              <tr style={{ backgroundColor: "#f2f2f2" }}>
                <th style={{ padding: "10px", textAlign: "left" }}>Course ID</th>
                <th style={{ padding: "10px", textAlign: "left" }}>Course Name</th>
                <th style={{ padding: "10px", textAlign: "left" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {offeredCourses.map((course) => (
                <tr key={course.id} style={{ borderBottom: "1px solid #ddd" }}>
                  <td style={{ padding: "10px" }}>{course.id}</td>
                  <td style={{ padding: "10px" }}>{course.courseName}</td>
                  <td style={{ padding: "10px" }}>
                    <button onClick={() => deleteCourse(course.id)} style={{ backgroundColor: "#f44336", color: "white", border: "none", padding: "8px 12px", borderRadius: "4px", cursor: "pointer" }}>
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
      </div>
    </div>
  );
};

export default TeacherHome;
