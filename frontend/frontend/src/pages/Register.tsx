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
    <div>
      <h2>Register</h2>
      {message && <p>{message}</p>}
      <form onSubmit={handleSubmit}>
        <input type="text" name="username" placeholder="Username" onChange={handleChange} required />
        <input type="password" name="password" placeholder="Password" onChange={handleChange} required />
        <input type="text" name="name" placeholder="Name" onChange={handleChange} required />
        <input type="text" name="address" placeholder="Address" onChange={handleChange} required />
        <select name="role" onChange={handleChange}>
          <option value="student">Student</option>
          <option value="teacher">Teacher</option>
        </select>
        {formData.role === "teacher" && (
          <input type="text" name="phone_no" placeholder="Phone Number" onChange={handleChange} required />
        )}
        <button type="submit">Register</button>
      </form>
    </div>
  );
};

export default Register;
