import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { setAvatarAPI } from "../../utils/ApiRequest.js";
import "./avatar.css";

const sprites = [
  "adventurer",
  "micah",
  "avataaars",
  "bottts",
  "initials",
  "adventurer-neutral",
  "big-ears",
  "big-ears-neutral",
  "big-smile",
  "croodles",
  "identicon",
  "miniavs",
  "open-peeps",
  "personas",
  "pixel-art",
  "pixel-art-neutral",
];

const toastOptions = {
  position: "bottom-right",
  autoClose: 2000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: false,
  draggable: true,
  progress: undefined,
  theme: "dark",
};

const SetAvatar = () => {
  const navigate = useNavigate();
  const [selectedAvatar, setSelectedAvatar] = useState(undefined);
  const [loading, setLoading] = useState(false);
  const [selectedSprite, setSelectedSprite] = useState(sprites[0]);
  const [imgURL, setImgURL] = useState([]);

  useEffect(() => {
    if (!localStorage.getItem("user")) {
      navigate("/login");
    } else {
      generateAvatars();
    }
  }, [navigate, selectedSprite]);

  const generateAvatars = useCallback(() => {
    setLoading(true);
    const imgData = Array(4).fill().map(() => 
      `https://api.dicebear.com/7.x/${selectedSprite}/svg?seed=${Math.random().toString(36).substring(7)}`
    );
    setImgURL(imgData);
    setLoading(false);
  }, [selectedSprite]);

  const handleSpriteChange = (e) => {
    setSelectedSprite(e.target.value);
  };

  const setProfilePicture = async () => {
    if (selectedAvatar === undefined) {
      toast.error("Please select an avatar", toastOptions);
    } else {
      try {
        const user = JSON.parse(localStorage.getItem("user"));
        const { data } = await axios.post(`${setAvatarAPI}/${user._id}`, {
          image: imgURL[selectedAvatar],
        });

        if (data.isSet) {
          user.isAvatarImageSet = true;
          user.avatarImage = data.image;
          localStorage.setItem("user", JSON.stringify(user));
          toast.success("Avatar selected successfully", toastOptions);
          navigate("/");
        } else {
          toast.error("Error setting avatar. Please try again", toastOptions);
        }
      } catch (error) {
        toast.error("An error occurred. Please try again", toastOptions);
      }
    }
  };

  return (
    <div className="avatar-container">
      <h1 className="avatar-title">Choose Your Avatar</h1>
      {loading ? (
        <div className="loading-spinner">
          <div className="spinner"></div>
        </div>
      ) : (
        <>
          <div className="avatar-grid">
            {imgURL.map((image, index) => (
              <div 
                key={index} 
                className={`avatar-item ${selectedAvatar === index ? 'selected' : ''}`}
                onClick={() => setSelectedAvatar(index)}
              >
                <img src={image} alt={`Avatar option ${index + 1}`} />
              </div>
            ))}
          </div>
          <div className="avatar-controls">
            <div className="select-container">
              <select onChange={handleSpriteChange} value={selectedSprite}>
                {sprites.map((sprite) => (
                  <option key={sprite} value={sprite}>
                    {sprite}
                  </option>
                ))}
              </select>
            </div>
            <button onClick={setProfilePicture} className="btn-set-avatar">
              Set as Profile Picture
            </button>
          </div>
        </>
      )}
      <ToastContainer />
    </div>
  );
};

export default SetAvatar;

