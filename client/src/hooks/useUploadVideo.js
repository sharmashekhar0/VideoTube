import { useDispatch, useSelector } from "react-redux";
import { onOpen, onClose, onToggle } from "../store/uploadVideoSlice"; // Adjust the path based on your project structure

const useUploadVideo = () => {
	const dispatch = useDispatch();
	const isOpen = useSelector((state) => state.uploadVideo.status);
	console.log(isOpen);
	const handleOpen = () => dispatch(onOpen());
	const handleClose = () => dispatch(onClose());
	const handleToggle = () => dispatch(onToggle());

	return {
		isOpen,
		onOpen: handleOpen,
		onClose: handleClose,
		onToggle: handleToggle,
	};
};

export default useUploadVideo;
