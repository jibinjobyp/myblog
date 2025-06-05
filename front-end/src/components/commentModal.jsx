import ReactDOM from "react-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { icons } from "../utils/Icons";
import './Comment.css'


export default function CommentModal({ children, onClose }) {
  return ReactDOM.createPortal(
    <div className="comment-modal-overlay" onClick={onClose}>
      <div
        className="comment-modal-content"
        onClick={(e) => e.stopPropagation()}
      >
        <button className="comment-modal-close" onClick={onClose}>
          <FontAwesomeIcon icon={icons.solid.times} />
        </button>
        {children}
      </div>
    </div>,
    document.getElementById("modal-root")
  );
}