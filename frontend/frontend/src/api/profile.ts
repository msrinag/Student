import axios from 'axios';

const API_BASE_URL = "http://localhost:6898";

// Fetch Student Profile
export const fetchStudentProfile = async (id: number, token: string) => {
  try {
    const response = await axios.get(`http://localhost:6898/api/students/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error: any) {
    console.error("Error fetching student profile:", error);
    return { error: error.response?.data || "Failed to fetch student profile" };
  }
};

// Fetch Teacher Profile
export const fetchTeacherProfile = async (id: number, token: string) => {
  try {
    const response = await axios.get(`http://localhost:6898/api/teachers/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error: any) {
    console.error("Error fetching teacher profile:", error);
    return { error: error.response?.data || "Failed to fetch teacher profile" };
  }
};




// Fetch Registered Courses for a Student
export const fetchRegisteredCourses = async (studentId: number, token: string) => {
  try {
    const response = await axios.get(`http://localhost:6898/api/registered-courses/${studentId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error : any) {
    console.error("Error fetching registered courses:", error);
    return { error: error.response?.data || "Failed to fetch registered courses" };
  }
};

// Drop a Course for a Student
export const dropCourse = async (studentId: number, courseId: number, token: string) => {
  try {
    const response = await axios.delete(`http://localhost:6898/api/students/${studentId}/courses/${courseId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error: any) {
    console.error("Error dropping course:", error);
    return { error: error.response?.data || "Failed to drop the course" };
  }
};

// Fetch all available courses
export const fetchAllCourses = async (token: string) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/api/courses`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
    
        return response.data;
    } catch (error:any) {
      console.error("Error fetching courses:", error);
      return { error: error.message };
    }
  };
  
  // Enroll in a course
  export const enrollCourse = async (courseId: number, token: string) => {
    try {
        const response = await fetch(`${API_BASE_URL}/student/enrollCourse`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`, // Include token if needed
            },
            body: JSON.stringify({ courseofferedid: courseId }),
          });
      return { message: response }; // Return as an object to maintain consistency
    } catch (error:any) {
      return { error: error.response?.data || "Something went wrong" };
    }
  };
