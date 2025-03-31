import { useState } from "react";
import { registerUser } from "../api/auth";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    role: "student",
    name: "",
    address: "",
    phone_no: "",
  });

  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const data = formData.role === "student" ? { ...formData, phone_no: undefined } : formData;
    const response = await registerUser(data);

    if (response.error) {
      setMessage(response.error);
    } else {
      setMessage("User registered successfully!");
      navigate("/login");
    }
  };

  return (
    <div style={{ display: "flex", justifyContent: "center ", alignItems: "center ", height: "100vh", backgroundColor: "#f4f4f4" }}>
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh", backgroundColor: "#f4f4f4" }}>
      <div style={{ width: "350px", padding: "2rem", border: "1px solid #ddd", borderRadius: "8px", backgroundColor: "white", boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)" }}>
        <h2 style={{ textAlign: "center", marginBottom: "1.5rem", color: "#333" }}>Register</h2>
        {message && <p style={{ color: message.startsWith("User") ? "green" : "red", marginBottom: "1rem", textAlign: "center" }}>{message}</p>}
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <input
            type="text"
            name="username"
            placeholder="Username"
            onChange={handleChange}
            required
            style={{ padding: "0.75rem", border: "1px solid #ccc", borderRadius: "4px" }}
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            onChange={handleChange}
            required
            style={{ padding: "0.75rem", border: "1px solid #ccc", borderRadius: "4px" }}
          />
          <input
            type="text"
            name="name"
            placeholder="Name"
            onChange={handleChange}
            required
            style={{ padding: "0.75rem", border: "1px solid #ccc", borderRadius: "4px" }}
          />
          <input
            type="text"
            name="address"
            placeholder="Address"
            onChange={handleChange}
            required
            style={{ padding: "0.75rem", border: "1px solid #ccc", borderRadius: "4px" }}
          />
          <select
            name="role"
            onChange={handleChange}
            style={{ padding: "0.75rem", border: "1px solid #ccc", borderRadius: "4px" }}
          >
            <option value="student">Student</option>
            <option value="teacher">Teacher</option>
          </select>
          {formData.role === "teacher" && (
            <input
              type="text"
              name="phone_no"
              placeholder="Phone Number"
              onChange={handleChange}
              required
              style={{ padding: "0.75rem", border: "1px solid #ccc", borderRadius: "4px" }}
            />
          )}
          <button
            type="submit"
            style={{ padding: "0.75rem 1rem", backgroundColor: "#007bff", color: "white", border: "none", borderRadius: "4px", cursor: "pointer" }}
          >
            Register
          </button>
        </form>
      </div>
    </div>
    </div>
  );
};

export default Register;