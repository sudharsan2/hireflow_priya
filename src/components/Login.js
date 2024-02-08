import React from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import "./login.css";
import { notification } from "antd";
import { jwtDecode } from "jwt-decode";

////////////////////////////////////////////////////////////////////////////////////

const Login = () => {
  const navigate = useNavigate();

  const validationSchema = Yup.object({
    username: Yup.string().required("Username is required"),
    password: Yup.string().required("Password is required"),
  });

  const formik = useFormik({
    initialValues: {
      username: "",
      password: "",
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        const res = await axios.post(
          "http://172.235.10.116:9090/hiring/auth/signin/",
          {
            username: values.username,
            password: values.password,
          }
        );

        // Extracting role from the decoded JWT
        const decodedToken = jwtDecode(res.data.tokens.access_token);
        const role = decodedToken.role;

        console.log("response", res.data);
        localStorage.setItem("accessToken", res.data.tokens.access_token);
        localStorage.setItem("userRole", role);
        // Show success notification
        notification.success({
          message: "Login Successful",
          description: "You have successfully logged in.",
        });

        // Conditionally navigate based on the user's role
        if (role === "ROLE_ADMIN") {
          navigate("/admin-page");
        } else if (role === "ROLE_RECRUITER") {
          navigate("/kanban-recurit");
        } else {
          // Navigate to a default page or handle other roles
          navigate("/");
        }
      } catch (err) {
        // Check if the error response contains a message
        const errorMessage = err.response
          ? err.response.data.message
          : "An error occurred during login.";

        console.log("Error", errorMessage);

        // Show error notification
        notification.error({
          message: "Login Failed",
          description: errorMessage,
        });
      }
    },
  });

  const imgurl1 = process.env.PUBLIC_URL + "./img/bg_3.mp4";
  const imgurl2 = process.env.PUBLIC_URL + "./img/login3.jpg";

  return (
    <div className="Login">
      <video autoPlay loop muted className="background-video" playsInline>
        <source src={imgurl1} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      <div className="content">
        <div className="login-container">
          <div className="image-container">
            <img src={imgurl2} alt="Background" />
          </div>
          <div className="form-container">
            <h1>Sign in to HireFlow</h1>
            <p>by FocusR AI</p>
            <form onSubmit={formik.handleSubmit}>
              <div className="form-group">
                <input
                  type="text"
                  id="username"
                  name="username"
                  placeholder="Enter your username"
                  value={formik.values.username}
                  onChange={formik.handleChange}
                />
                {formik.touched.username && formik.errors.username && (
                  <div className="error">{formik.errors.username}</div>
                )}
              </div>
              <div className="form-group">
                <input
                  type="password"
                  id="password"
                  name="password"
                  placeholder="Enter your password"
                  value={formik.values.password}
                  onChange={formik.handleChange}
                />
                {formik.touched.password && formik.errors.password && (
                  <div className="error">{formik.errors.password}</div>
                )}
              </div>
              <div className="additional-options">
                <label>
                  <input type="checkbox" name="rememberMe" />
                  Remember Me
                </label>
                <a href="#forgot-password" className="forgot-password">
                  Forgot Password?
                </a>
              </div>
              <button type="submit" disabled={formik.isSubmitting}>
                {formik.isSubmitting ? "Logging in..." : "Login"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
