import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { useSelector } from 'react-redux';
import {
  Avatar,
  Button,
  Paper,
  Grid,
  Typography,
  Container,
} from "@material-ui/core";
import { useHistory } from "react-router-dom";
import { GoogleLogin } from "react-google-login";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";

import Icon from "./icon";
import { signin, signup, getUsers } from "../../actions/auth";
import { AUTH } from "../../constants/actionTypes";
import useStyles from "./styles";
import Input from "./Input";

const initialState = {
  firstName: "",
  lastName: "",
  email: "",
  password: "",
  confirmPassword: "",
};

const SignUp = () => {

  const [form, setForm] = useState(initialState);
  const [validate, setValidate] = useState({
    errFname: "",
    errLname: "",
    errEmail: "",
    errPassLength: "",
    errPass: "",
    errCpass: "",
  });
  const [isSignup, setIsSignup] = useState(false);
  const dispatch = useDispatch();
  const history = useHistory();
  const classes = useStyles();
  const users = useSelector((state) => state.auth);

  const [showPassword, setShowPassword] = useState(false);
  const handleShowPassword = () => setShowPassword(!showPassword);

  const switchMode = () => {
    setForm(initialState);
    setIsSignup((prevIsSignup) => !prevIsSignup);
    setShowPassword(false);
  };


  useEffect(() => {
    dispatch(getUsers());
  }, [])

  const validateUserInfo = () => {

    var counterName = 0;
    var counterLast = 0;
    var counterPlength = 0;
    var counterPvalid = 0;
    var counterCValid = 0;
    var counterUserExist = 0;

    const isPasswordValid = form.password;

    if (
      !form.firstName.match(/^[a-zA-Z]+$/) ||
      !form.lastName.match(/^[a-zA-Z]+$/)
    ) {
      console.log("Should not contain special characters");
      setValidate({
        ...validate,
        errFname: "Should not contain special characters",
      });
      counterName = 1;
    }
    if (!form.lastName.match(/^[a-zA-Z]+$/)) {
      console.log("Should not contain special characters");
      setValidate({
        ...validate,
        errLname: "Should not contain special characters",
      });
      counterLast = 1;
    }

    if (isPasswordValid.length < 8) {
      console.log("Must be at least 8 characters long");
      setValidate({
        ...validate,
        errPassLength: "Must be at least 8 characters long",
      });
      counterPlength = 1;
    }
    if (isPasswordValid.match(/^[a-zA-Z0-9@#*&^%!`~()-_=+{}|'";:?.,]+$/)) {
      console.log("Must contain alphanumeric and special characters ");
      setValidate({
        ...validate,
        errPass: "Must contain alphanumeric and special characters",
      });
      counterPvalid = 1;
    }
    if (form.password !== form.confirmPassword) {
      console.log("Password does not match");
      setValidate({ ...validate, errCpass: "Password does not match" });
      counterCValid = 1;
    }

    users.map((user) => {
      if(form.email === user.email) {
        console.log('Already Exists!');
        setValidate({ ...validate, errEmail: "Email is already registered" });
        counterUserExist = 1;
      }
    })


    const counter =
      counterName +
      counterLast +
      counterPlength +
      counterPvalid +
      counterCValid +
      counterUserExist;

    return counter;

  }

  const handleSubmit = (e) => {
    e.preventDefault();

    console.log(users);
    if (isSignup) {
      if (validateUserInfo() === 0) {
        dispatch(signup(form, history));
      }
    } else {
      users.map((user) => {
        if(form.email !== user.email) {
          setValidate({ ...validate, errEmail: "Email does not Exists!" });
        }else{
          dispatch(signin(form, history));
        }
      })
    }
  };

  const googleSuccess = async (res) => {
    const result = res?.profileObj;
    const token = res?.tokenId;

    try {
      dispatch({ type: AUTH, data: { result, token } });

      history.push("/");
    } catch (error) {
      console.log(error);
    }
  };

  const googleError = () =>
    alert("Google Sign In was unsuccessful. Try again later");

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  return (
    <Container component="main" maxWidth="xs">
      <Paper className={classes.paper} elevation={3}>
        <Avatar className={classes.avatar}> 
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          {isSignup ? "Sign up" : "Sign in"}
        </Typography>
        <form className={classes.form} onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            {isSignup && (
              <>
                <Input
                  name="firstName"
                  label="First Name"
                  handleChange={handleChange}
                  autoFocus
                  half
                />
                <Input
                  name="lastName"
                  label="Last Name"
                  handleChange={handleChange}
                  half
                />
                <div className={classes.validate}>
                  <Typography variant="subtitle2" color="secondary">
                   {form.firstName.length === 0 ? '' : validate.errFname}
                  </Typography>
                </div>
                <div className={classes.validate}>
                  <Typography variant="subtitle2" color="secondary">
                  {form.lastName.length === 0 ? '' : validate.errLname}
                  </Typography>
                </div>
              </>
            )}
            <Input
              name="email"
              label="Email Address"
              handleChange={handleChange}
              type="email"
            />
             <div className={classes.validate}>
                  <Typography variant="subtitle2" color="secondary">
                    {validate.errEmail}
                  </Typography>
                </div>
            <Input
              name="password"
              label="Password"
              handleChange={handleChange}
              type={showPassword ? "text" : "password"}
              handleShowPassword={handleShowPassword}
            />
            {isSignup && (
              <div className={classes.validate}>
                <Typography variant="subtitle2" color="secondary">
                  {validate.errPass}
                </Typography>
              </div>
            )}
            {isSignup && (
              <div className={classes.validate}>
                <Typography variant="subtitle2" color="secondary">
                  {validate.errPassLength}
                </Typography>
              </div>
            )}
            {isSignup && (
              <Input
                name="confirmPassword"
                label="Repeat Password"
                handleChange={handleChange}
                type="password"
              />
            )}
            {isSignup && (
              <div className={classes.validate}>
                <Typography variant="subtitle2" color="secondary">
                  {validate.errCpass}
                </Typography>
              </div>
            )}
          </Grid>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
          >
            {isSignup ? "Sign Up" : "Sign In"}
          </Button>
          <GoogleLogin
            clientId="915234081013-94gphnqm07vak5p0ue5r4l90vclv4cgg.apps.googleusercontent.com"
            render={(renderProps) => (
              <Button
                className={classes.googleButton}
                color="primary"
                fullWidth
                onClick={renderProps.onClick}
                disabled={renderProps.disabled}
                startIcon={<Icon />}
                variant="contained"
              >
                Google Sign In
              </Button>
            )}
            onSuccess={googleSuccess}
            onFailure={googleError}
            cookiePolicy="single_host_origin"
          />
          <Grid container justify="flex-end">
            <Grid item>
              <Button onClick={switchMode}>
                {isSignup
                  ? "Already have an account? Sign in"
                  : "Don't have an account? Sign Up"}
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Container>
  );
};

export default SignUp;
