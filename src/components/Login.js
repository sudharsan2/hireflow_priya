import React, { useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import "./login.css";
import { Alert, notification } from "antd";
import { jwtDecode } from "jwt-decode";
import { useDispatch } from "react-redux";
import {
  fetchLoginDetailsAsync,
  getErrorFromAuth,
  getIsAuthenticatedFromAuth,
  getIsLoadingFromAuth,
} from "../redux/slices/authSlice";
import useIsMountedRef from "../hooks/useIsMountedRef";
import { useSelector } from "react-redux";

////////////////////////////////////////////////////////////////////////////////////

const Login = () => {
  const isMountedRef = useIsMountedRef();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const isLoading = useSelector(getIsLoadingFromAuth);
  const isAuthenticated = useSelector(getIsAuthenticatedFromAuth);
  const isError = useSelector(getErrorFromAuth);
  const LoginSchema = Yup.object({
    username: Yup.string().required("Username is required"),
    password: Yup.string().required("Password is required"),
  });

  const formik = useFormik({
    initialValues: {
      username: "",
      password: "",
    },
    validationSchema: LoginSchema,
    onSubmit: async (values, { setErrors, setSubmitting, resetForm }) => {
      try {
        dispatch(fetchLoginDetailsAsync(values));

        if (isMountedRef.current) {
          setSubmitting(false);
        }
      } catch (error) {
        console.error(error);
        resetForm();
        if (isMountedRef.current) {
          setSubmitting(false);
          setErrors({ afterSubmit: error.message });
        }
      }
    },
  });

  useEffect(() => {
    const role = localStorage.getItem("role");
    if (isAuthenticated) {
      if (role === "ROLE_ADMIN") {
        navigate("/admin-page");
      } else if (role === "ROLE_RECRUITER") {
        navigate("/kanban-recurit");
      } else {
        // Navigate to a default page or handle other roles
        navigate("/");
      }
    }
  }, [isAuthenticated, navigate]);

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
              {isError !== "" && <Alert severity="error">{isError}</Alert>}
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

export default Login;