import "./LoginForm.css";
import { useState, useEffect } from "react";

const LoginForm = (props) => {
	const initialState = {
		username: "",
		password: "",
		confirm: "",
	};

	const [activeForm, setActiveForm] = useState("login");
	const [formContent, setFormContent] = useState(initialState);
	const [allUsers, setAllUsers] = useState([]);
	const [refresh, setRefresh] = useState("0");
	const [warning, setWarning] = useState(null);

	const URL = props.contents.URL;

	// This function is solely changing the value to force a rerender
	const handleRefresh = () => {
		if (refresh === "0") {
			setRefresh("1");
		} else {
			setRefresh("0");
		}
	};

	//Fetch for the selected user, Only ocurs after a succesful login
	const getUser = async (userID) => {
		try {
			const response = await fetch(`${URL}user/${userID}`);
			let user = await response.json();
			props.contents.setUser(user);
		} catch (error) {
			console.log(error);
		}
	};

	//Fetching a list of all users in database upon everytime the refresh state gets updated
	useEffect(() => {
		const getUsers = async () => {
			try {
				const response = await fetch(`${URL}user`);
				let users = await response.json();

				setAllUsers(users);
				props.contents.setUserList(users);
			} catch (error) {
				console.log(error);
			}
		};
		getUsers();
	}, [refresh]);

	//Making a refresh upon loading so GetUsers Runs for the first time
	useEffect(() => {
		handleRefresh();
	}, []);

	//looping through the list of users to see iif the input matches an existing user
	const userExists = (users, username) => {
		if (users.length > 0) {
			for (let i = 0; i < users.length; i++) {
				if (users[i].username.toLowerCase() === username.toLowerCase()) {
					return users[i];
				}
			}
		}
	};

	//Post route to create a new user with the data provided by the form
	const createUser = async (userData) => {
		try {
			await fetch(`${URL}user`, {
				method: "post",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(userData),
			}).then(() => {
				handleRefresh();
			});
		} catch (error) {}
	};

	//Will check if the user credentials match something in the database
	const loginSubmit = (e) => {
		e.preventDefault();
		let foundUser = userExists(allUsers, formContent.username);
		if (foundUser && formContent.password === foundUser.password) {
			getUser(foundUser._id);
			setWarning("Logged in! Loading...");
		} else {
			setWarning("invalid credentials");
		}
	};

	//Will create a new user and push it to the database
	const signupSubmit = (e) => {
		e.preventDefault();
		let foundUser = false;
		// If no fields are empty, we proceed to evaluate
		if (
			formContent.password.length > 1 &&
			formContent.username.length > 1 &&
			formContent.confirm.length > 1
		) {
			//Will check if the usename already exists
			for (let i = 0; i < props.contents.userList.length; i++) {
				if (
					props.contents.userList[i].username.toLowerCase() ===
					formContent.username.toLowerCase()
				) {
					setWarning("username not available");
					foundUser = true;
					break;
				}
			}
			// if the user doesn't exist  it will check that the passwords match
			if (!foundUser) {
				//If passwords match, we will call a POST route using the information from the form
				if (formContent.password === formContent.confirm) {
					createUser({
						username: formContent.username,
						password: formContent.password,
						displayname: formContent.username,
					});
					changeForm();
					e.target.reset();
					setFormContent(initialState);
				} else {
					setWarning("passwords don't match");
				}
			}
		} else {
			setWarning("Please complete all fields");
		}
	};

	//keeping track of updates on the form
	const handleChange = (e) => {
		setFormContent({ ...formContent, [e.target.name]: e.target.value });
	};

	//Will alternate between the forms being displayed, updating the necessary States
	const changeForm = () => {
		if (activeForm === "login" || !activeForm) {
			setActiveForm("signup");
		} else {
			setActiveForm("login");
		}
		setWarning(null);
	};

	// HTML elements for login form
	const loginForm = (
		<>
			<h2 className="form-name">Login</h2>
			<form className="forms" onSubmit={loginSubmit}>
				<input
					type="text"
					placeholder="username"
					name="username"
					onChange={handleChange}
					className="login-input"
				/>
				<input
					type="password"
					placeholder="password"
					name="password"
					onChange={handleChange}
					className="login-input"
				/>
				<p className="warning">{warning ? warning : ""}</p>
				<input className="submit-button" type="submit" />
				<p>
					Don't have an account?{" "}
					<span className="change-form" onClick={changeForm}>
						Create One!
					</span>
				</p>
			</form>
		</>
	);

	//HTML elements for signup form
	const signupForm = (
		<>
			<h2 className="form-name">Sign up</h2>
			<form className="forms" onSubmit={signupSubmit}>
				<input
					type="text"
					placeholder="username"
					name="username"
					onChange={handleChange}
					className="login-input"
				/>
				<input
					type="password"
					placeholder="password"
					name="password"
					onChange={handleChange}
					className="login-input"
				/>
				<input
					type="password"
					placeholder="confirm password"
					name="confirm"
					onChange={handleChange}
					className="login-input"
				/>
				<p className="warning">{warning ? warning : ""}</p>
				<input className="submit-button" type="submit" />
				<p>
					Already have an account?{" "}
					<span className="change-form" onClick={changeForm}>
						Log In!
					</span>
				</p>
			</form>
		</>
	);

	//rendering the active form
	return (
		<div className="form-container">
			{activeForm === "login" ? loginForm : signupForm}
		</div>
	);
};
export default LoginForm;
