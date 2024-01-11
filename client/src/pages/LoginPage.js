import React, { useState, useEffect, useContext } from "react";
import Axios from "axios";
import "../styles/loginPage.scss";
import { Formik, Form, useField } from "formik";
import { useNavigate } from "react-router-dom";
import * as Yup from "yup";
import { StoreContext } from "../store/StoreProvider";

const BASE_URL = "https://game-site-api.vercel.app";

const LoginPage = () => {
  let navigate = useNavigate();

  const [loginStatus, setLoginStatus] = useState("");
  const [logResponseDissapear, setLogResponseDissapear] = useState(false);

  const [registerStatus, setRegisterStatus] = useState("");
  const [regResponseDissapear, setRegResponseDissapear] = useState(false);

  const [rememberMe, setRememberMe] = useState(false);

  const { userData, setUserData, setUserJWT } = useContext(StoreContext);

  const handleRegister = (values) => {
    Axios.post(`${BASE_URL}/register`, {
      email: values.emailReg,
      nick: values.nick,
      password: values.passwordReg,
    }).then((res) => {
      if (res.status === 200) {
        setRegisterStatus(res.data.message);
        setRegResponseDissapear(false);
        setTimeout(() => setRegResponseDissapear(true), 2000);
      }
    });
  };

  const handleLogin = (values) => {
    Axios.post(`${BASE_URL}/login`, {
      email: values.emailLog,
      password: values.passwordLog,
    }).then((res) => {
      setLogResponseDissapear(false);

      if (res.status === 200) {
        const { auth, nick, isLogged } = res.data;
        setUserData({ auth, nick, isLogged });

        setTimeout(() => {
          setLogResponseDissapear(true);
        }, 2000);

        if (res.data.isLogged && res.data.auth) {
          if (rememberMe) {
            localStorage.setItem("rememberMe", values.emailLog);
          } else {
            if (Boolean(localStorage.rememberMe)) {
              localStorage.removeItem("rememberMe");
            }
          }

          localStorage.setItem("token", res.data.token);
          setUserJWT(res.data.token);
          navigate("/");
        } else {
          setLoginStatus(res.data.message);
        }
      }
    });
  };

  const CustomTextInput = ({ label, ...props }) => {
    const [field, meta] = useField(props);
    return (
      <>
        <label htmlFor={props.id || props.name}>{label}</label>
        <input className='text-input' {...field} {...props} />
        {meta.touched && meta.error ? (
          <div className='error'>{meta.error}</div>
        ) : null}
      </>
    );
  };

  return (
    <div className='login-page'>
      <Formik
        initialValues={{
          nick: "",
          emailReg: "",
          passwordReg: "",
          confirmPasswordReg: "",
          file: null,
        }}
        validationSchema={Yup.object({
          nick: Yup.string()
            .min(2, "Must be at least 2 characters")
            .max(30, "Must be at 30 characters or less")
            .required("Required"),
          emailReg: Yup.string()
            .email("Invalid email address")
            .required("Required"),
          passwordReg: Yup.string()
            .matches(
              /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/,
              "8 Characters, One Uppercase, One Lowercase, One Number and One Special Character"
            )
            .required("Required"),
          confirmPasswordReg: Yup.string()
            .oneOf([Yup.ref("passwordReg"), null], "Password must match")
            .required("Required"),
        })}
        onSubmit={(values, { setSubmitting, resetForm }) => {
          setTimeout(() => {
            handleRegister(values);
            resetForm();
            setSubmitting(false);
          }, 2000);
        }}
      >
        {(props) => (
          <Form className='register-panel'>
            <h1>Register</h1>
            <CustomTextInput
              label=''
              name='nick'
              type='text'
              placeholder='Nick'
            />
            <CustomTextInput
              label=''
              name='passwordReg'
              type='password'
              placeholder='Password'
            />
            <CustomTextInput
              label=''
              name='confirmPasswordReg'
              type='password'
              placeholder='Confirm Password'
            />
            <CustomTextInput
              label=''
              name='emailReg'
              type='email'
              placeholder='Email'
            />
            <button type='submit'>
              {props.isSubmitting ? "Loading..." : "Submit"}
            </button>

            <h4
              className={`register-response-text ${
                regResponseDissapear && "dissapear"
              }`}
            >
              {registerStatus}
            </h4>
          </Form>
        )}
      </Formik>

      <Formik
        initialValues={{
          emailLog: Boolean(localStorage.rememberMe)
            ? localStorage.rememberMe
            : "",
          passwordLog: "",
        }}
        validationSchema={Yup.object({
          emailLog: Yup.string()
            .email("Invalid email address")
            .required("Required"),
          passwordLog: Yup.string().required("Required"),
        })}
        onSubmit={(values, { setSubmitting, resetForm }) => {
          setTimeout(() => {
            handleLogin(values);
            resetForm();
            setSubmitting(false);
          }, 2000);
        }}
      >
        {(props) => (
          <Form className='login-panel'>
            <h1>Log in</h1>

            <CustomTextInput
              label=''
              name='emailLog'
              type='email'
              placeholder='Email'
            />
            <CustomTextInput
              label=''
              name='passwordLog'
              type='password'
              placeholder='Password'
            />

            <label htmlFor='remember-me' className='remember-me'>
              <input
                name='remember-me'
                type='checkbox'
                onChange={() => setRememberMe((prev) => !prev)}
                checked={rememberMe}
              />
              remember me
            </label>

            <button type='submit'>
              {props.isSubmitting ? "Loading..." : "Log in"}
            </button>

            <h4
              className={`login-response-text ${
                logResponseDissapear && "dissapear"
              }`}
            >
              {loginStatus}
            </h4>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default LoginPage;
