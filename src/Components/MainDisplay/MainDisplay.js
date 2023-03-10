import "./MainDisplay.css";
import Chat from "./Chat/Chat.js";

const MainDisplay = (props) => {
	//welcome page displayes while there's no chat selected
	const welcomePage = (
		<div className="welcome-page">
			<div className="whatsapp image"></div>
			<h2 className="title">WhatsApp Web</h2>
			<p className="welcome-text">
				{" "}
				Select a chat or find a user to start chatting
			</p>
		</div>
	);
	return (
		<div
			className={
				"main-display " +
				//for responsive design. sidebar will not display if the user is currently on sidebar
				(props.contents.mobileView === "main"
					? "mobile-active"
					: "mobile-inactive")
			}
		>
			{props.contents.selectedChat ? (
				<Chat contents={props.contents} />
			) : (
				welcomePage
			)}
		</div>
	);
};
export default MainDisplay;
