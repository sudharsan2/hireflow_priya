
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import "./login.css";
import { Alert, Button, notification } from "antd";
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
import { EyeOutlined, EyeInvisibleOutlined } from '@ant-design/icons';
 
const Login = () => {
  const isMountedRef = useIsMountedRef();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const isLoading = useSelector(getIsLoadingFromAuth);
  const isAuthenticated = useSelector(getIsAuthenticatedFromAuth);
  const isError = useSelector(getErrorFromAuth);
  const [showPassword, setShowPassword] = useState(false);
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
        console.log("error")
        resetForm();
        if (isMountedRef.current) {
          setSubmitting(false);
          // Show error notification
          notification.error({
            message: "Login Failed",
            description: isError || "An error occurred during login.",
          });
        }
      }
    },
  });
 
  useEffect(() => {
    const role = localStorage.getItem("role");
    if (isAuthenticated === 2) {
      switch (role) {
        case "ROLE_ADMIN":
          navigate("/admin-page");
          break;
        case "ROLE_RECRUITER":
          navigate("/kanban-recurit");
          break;
        case "ROLE_INTERVIEWER":
          navigate("/kanban-interviewer");
          break;
        default:
          navigate("/");
      }
      // Show notification when API call is finished
      notification.success({
        message: "Login Successful",
        description: "You have successfully logged in.",
      });
    } else if (isAuthenticated === 3) {
      notification.error({
        message: "Login Failed",
        description: isError || "An error occurred during login.",
      });
    }
  }, [isAuthenticated, navigate]);
 
  const imgurl1 = process.env.PUBLIC_URL + "./img/bg_3.mp4";
  const imgurl2 = process.env.PUBLIC_URL + "./img/login3.jpg";
 
  const handleTogglePassword = () => {
    setShowPassword(!showPassword);
  };
 
  const handleSubmit = async () => {
    try {
      const response = await axios.post(
        "https://hireflowapidev.focusrtech.com:90/hiring/auth/signin/",
        {
          username: formik.values.username,
          password: formik.values.password
        }
      );
 
      const token = response.data.tokens.access_token;
 
      localStorage.setItem("accessToken", response.data.tokens.access_token);
      const { exp, role, username, email, empId } = jwtDecode(response.data.tokens.access_token);
      localStorage.setItem("role", role);
      localStorage.setItem("empId", empId)
      localStorage.setItem("username", username);
      localStorage.setItem("mail", email);
      if(role==="ROLE_ADMIN"){
        navigate("/admin-page");
        notification.success({
          message: "Login Successful",
          description: "You have successfully logged in.",
        });
      }
      else if(role==="ROLE_RECRUITER"){
        navigate("/kanban-recurit");
        notification.success({
          message: "Login Successful",
          description: "You have successfully logged in.",
        });
      }
      else if (role==="ROLE_INTERVIEWER"){
        navigate("/kanban-interviewer");
        notification.success({
          message: "Login Successful",
          description: "You have successfully logged in.",
        });
      }
    } catch (exception) {
      notification.error({
        message: "Login Failed",
        description: "Invalid Credentials, Please check Your Credentials again  🥹",
      })
    }
  }
 
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
            <div>
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
                <div className="password-input">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    name="password"
                    placeholder="Enter your password"
                    value={formik.values.password}
                    onChange={formik.handleChange}
                  />
                  {showPassword ? (
                    <EyeInvisibleOutlined
                      onClick={handleTogglePassword}
                      className="eye-icon"
                    />
                  ) : (
                    <EyeOutlined
                      onClick={handleTogglePassword}
                      className="eye-icon"
                    />
                  )}
                </div>
                {formik.touched.password && formik.errors.password && (
                  <div className="error">{formik.errors.password}</div>
                )}
              </div>
              <div className="additional-options">
                <label>
                  <input type="checkbox" name="rememberMe" />
                  Remember Me
                </label>
                <Link to="/forgotPassword" className="forgot-password">
                  Forgot Password?
                </Link>
              </div>
              <Button
                className="log-button"
                type="primary"
                loading={isLoading}
                disabled={formik.isSubmitting}
                onClick={handleSubmit}
              >
                Login
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
 
export default Login;
 