import {
  faHeart,
  faComment,
  faPaperPlane,
  faCommentSlash,
  faUser,
  faTimes,
  faEnvelope, // ✅ ADD THIS LINE
} from "@fortawesome/free-solid-svg-icons";

import { faHeart as regularHeart } from "@fortawesome/free-regular-svg-icons";

export const icons = {
  solid: {
    like: faHeart,
    comment: faComment,
    paperPlane: faPaperPlane,
    commentSlash: faCommentSlash,
    user: faUser,
    times: faTimes,
    message: faEnvelope, // ✅ ADD THIS LINE
  },
  regular: {
    like: regularHeart,
  },
};
