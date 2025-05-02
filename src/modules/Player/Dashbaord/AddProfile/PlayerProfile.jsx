import React, { useState } from "react";
import { FiUpload } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import Swal from "sweetalert2";
import axios from "axios";
import { updateUserState } from "../../../../redux/user/userSlice";

const PlayerProfile = () => {
  const { currentUser } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const [userProfileData, setUserProfileData] = useState({
    profilePicture: currentUser?.profilePicture || null,
    username: currentUser?.username || "",
    dob: currentUser?.dob || "",
    home: currentUser?.home || "",
    address_line_1: currentUser?.address_line_1 || "",
    address_line_2: currentUser?.address_line_2 || "",
    postcode: currentUser?.postcode || "",
    phoneNumber: currentUser?.phoneNumber || "",
    city: currentUser?.city || "",
    country: currentUser?.country || "",
    hearAbout: currentUser?.hearAbout || "",
    school: currentUser?.school || "",
    homeAlone: currentUser?.homeAlone || "",
    whatsapp: currentUser?.whatsapp || "",
    ethnicBackground: currentUser?.ethnicBackground || "",
    guardianName: currentUser?.guardianName || "",
    guardianEmail: currentUser?.guardianEmail || "",
    guardianMobile: currentUser?.guardianMobile || "",
    guardianRelation: currentUser?.guardianRelation || "",
    contact2Name: currentUser?.contact2Name || "",
    contact2Email: currentUser?.contact2Email || "",
    contact2Mobile: currentUser?.contact2Mobile || "",
    contact2Relation: currentUser?.contact2Relation || "",
    healthNotes: currentUser?.healthNotes || "",
    playerId: currentUser?._id || "",
  });

  const [imageFile, setImageFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const errors = {};
    if (!userProfileData.username) errors.username = "Username is required";
    if (!userProfileData.email || !/\S+@\S+\.\S+/.test(userProfileData.email)) {
      errors.email = "Valid email is required";
    }
    if (
      !userProfileData.phoneNumber ||
      !/^\d{10}$/.test(userProfileData.phoneNumber)
    ) {
      errors.phoneNumber = "Phone number is required (10 digits)";
    }
    if (!userProfileData.guardianName)
      errors.guardianName = "Guardian name is required";
    if (!userProfileData.home) errors.home = "This field is required";
    if (!userProfileData.whatsapp) errors.whatsapp = "This field is required";
    if (!userProfileData.ethnicBackground)
      errors.ethnicBackground = "This field is required";
    if (!userProfileData.address_line_1) {
      errors.address_line_1 = "Valid Address Line 01 is required";
    }
    if (!userProfileData.dob || !/\S+@\S+\.\S+/.test(userProfileData.dob)) {
      errors.dob = "This field is required";
    }
    if (!userProfileData.city) errors.city = "This field is required";
    if (!userProfileData.country) errors.country = "This field is required";
    if (!userProfileData.postcode) errors.postcode = "This field is required";

    setErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserProfileData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      // Preview the image
      const reader = new FileReader();
      reader.onload = () => {
        setUserProfileData((prev) => ({
          ...prev,
          profilePicture: reader.result,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSessionSubmit = async (e) => {
    e.preventDefault();
    // if (!validateForm()) return;

    try {
      setLoading(true);

      const formData = new FormData();

      // Append all user data to formData
      Object.entries(userProfileData).forEach(([key, value]) => {
        if (key !== "profilePicture" && value !== null) {
          formData.append(key, value);
        }
      });

      // Append the image file if it exists
      if (imageFile) {
        formData.append("imageFile", imageFile);
      }

      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/player/profile/update/${
          currentUser?._id
        }`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      dispatch(updateUserState(response?.data?.updatedProfile));

      Swal.fire({
        title: "Profile updated successfully",
        icon: "success",
      });
    } catch (error) {
      console.error("Error updating profile:", error);
      Swal.fire({
        title: "Failed to update profile",
        icon: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-[100%] mx-auto ">
      <div className="pt-10">
        <h1 className="text-4xl text-gray-800 font-semibold text-center  mb-8">
          Player Profile
        </h1>
      </div>

      <div className="w-[100%] shadow-lg rounded-xl py-4 mx-auto">
        <h1 className="text-center text-[20px] pb-3 uppercase font-semibold">
          Basic Info / Edit Profile
        </h1>
        <div className="w-[95%] mx-auto  ">
          <form onSubmit={handleSessionSubmit}>
            {/* Profile Image */}
            <div className="flex justify-center gap-10">
              <div className="my-4 App">
                <label
                  htmlFor="fileId"
                  className="text-[#8E8E8E] flex justify-center gap-3 items-center"
                >
                  <FiUpload className="text-[#8E8E8E]" />
                  Upload profile picture
                </label>
                {imageFile && <p className="mt-2 text-sm">{imageFile.name}</p>}
                <input
                  type="file"
                  name="profilePicture"
                  width={100}
                  height={100}
                  onChange={handleImageChange}
                  accept="image/*"
                  id="fileId"
                />
                <div></div>
              </div>
            </div>

            {/* ------------ */}

            <div className="grid-item">
              <div>
                <label htmlFor="email">Email</label>
                <input
                  type="text"
                  id="email"
                  className="border-gray-300 border-2 rounded-lg py-2 px-3 focus:outline-none focus:border-blue-400 w-full"
                  name="email"
                  onChange={handleInputChange}
                  value={currentUser?.email}
                  placeholder="Email"
                  disabled
                />
              </div>
              <div>
                <label htmlFor="email">Username</label>
                <input
                  type="text"
                  id="username"
                  className="border-gray-300 border-2 rounded-lg py-2 px-3 focus:outline-none focus:border-blue-400 w-full"
                  name="username"
                  onChange={handleInputChange}
                  value={userProfileData?.username}
                  placeholder="Enter your name"
                />
              </div>

              <div>
                <label htmlFor="phoneNumber">Phone Number</label>
                <input
                  type="number"
                  id="phoneNumber"
                  className="border-gray-300 border-2 rounded-lg py-2 px-3 focus:outline-none focus:border-blue-400 w-full"
                  name="phoneNumber"
                  onChange={handleInputChange}
                  value={userProfileData.phoneNumber}
                  placeholder="Phone Number"
                />
              </div>

              <div>
                <label htmlFor="home">Home Number or Name</label>
                <input
                  type="text"
                  id="home"
                  className="border-gray-300 border-2 rounded-lg py-2 px-3 focus:outline-none focus:border-blue-400 w-full"
                  name="home"
                  onChange={handleInputChange}
                  value={userProfileData.home}
                  placeholder="Home Number or Name"
                />
                {errors.home && (
                  <p className="text-red-300 text-sm mt-1">{errors.home}</p>
                )}
              </div>

              <div>
                <label htmlFor="address_line_1">Address Line 01</label>
                <input
                  type="text"
                  id="address_line_1"
                  className="border-gray-300 border-2 rounded-lg py-2 px-3 focus:outline-none focus:border-blue-400 w-full"
                  name="address_line_1"
                  onChange={handleInputChange}
                  value={userProfileData.address_line_1}
                  placeholder="Address Line 01"
                />
                {errors.address_line_1 && (
                  <p className="text-red-300 text-sm mt-1">
                    {errors.address_line_1}
                  </p>
                )}
              </div>

              <div>
                <label htmlFor="address_line_2">Address Line 02</label>
                <input
                  type="text"
                  id="address_line_2"
                  className="border-gray-300 border-2 rounded-lg py-2 px-3 focus:outline-none focus:border-blue-400 w-full"
                  name="address_line_2"
                  onChange={handleInputChange}
                  value={userProfileData.address_line_2}
                  placeholder="Address Line 02 (Optional)"
                />
              </div>

              <div>
                <label htmlFor="city">Town or City</label>
                <input
                  type="text"
                  id="city"
                  className="border-gray-300 border-2 rounded-lg py-2 px-3 focus:outline-none focus:border-blue-400 w-full"
                  name="city"
                  onChange={handleInputChange}
                  value={userProfileData.city}
                  placeholder="Town or City"
                />
                {errors.city && (
                  <p className="text-red-300 text-sm mt-1">{errors.city}</p>
                )}
              </div>
              <div>
                <label htmlFor="country">Country or Area</label>
                <input
                  type="text"
                  id="country"
                  className="border-gray-300 border-2 rounded-lg py-2 px-3 focus:outline-none focus:border-blue-400 w-full"
                  name="country"
                  onChange={handleInputChange}
                  value={userProfileData.country}
                  placeholder="Country or Area"
                />
                {errors.country && (
                  <p className="text-red-300 text-sm mt-1">{errors.country}</p>
                )}
              </div>

              <div>
                <label htmlFor="postcode">PostCode</label>
                <input
                  type="text"
                  id="postcode"
                  className="border-gray-300 border-2 rounded-lg py-2 px-3 focus:outline-none focus:border-blue-400 w-full"
                  name="postcode"
                  onChange={handleInputChange}
                  value={userProfileData.postcode}
                  placeholder="PostCode"
                />
                {errors.postcode && (
                  <p className="text-red-300 text-sm mt-1">{errors.postcode}</p>
                )}
              </div>

              <div>
                <label htmlFor="dob" className="mt-3">
                  Date Of Birth
                </label>
                <input
                  className="border-gray-300 border-2 rounded-lg py-2 px-3 focus:outline-none focus:border-blue-400 w-full"
                  type="date"
                  id="dob"
                  name="dob"
                  onChange={handleInputChange}
                  value={userProfileData.dob ? userProfileData.dob : ""}
                />
              </div>
            </div>

            <hr className="my-5" />
            {/* -- extra info ---- */}

            {/* hear about----------- */}
            <div className="flex flex-col mt-3">
              <label htmlFor="">Where did you hear about Ball Contrl? *</label>
              <select
                type="text"
                className=" outline-none border-gray-300 border-2 rounded-lg py-2 px-3 focus:outline-none focus:border-blue-400 w-full "
                name="hearAbout"
                value={userProfileData.hearAbout}
                onChange={handleInputChange}
              >
                <option value="Online Search"></option>
                <option value="Online Search">
                  Online Search (Google etc)
                </option>
                <option value="Word of mouth">Word of mouth</option>
                <option value="Flyer / Poster">Flyer / Poster</option>
                <option value="Social Media">Social Media</option>
                <option value="Banner">Banner</option>
                <option value="Facebook">Facebook</option>
                <option value="School Newsletter">School Newsletter</option>
                <option value="Email">Email</option>
                <option value="Dulwich Diverter">Dulwich Diverter</option>
                <option value="Other">Other</option>
              </select>
            </div>
            {/* ---------school -------------- */}
            <div className="flex flex-col mt-3">
              <label htmlFor="">
                What school or college does the player attend? *
              </label>
              <input
                type="text"
                className=" border-gray-300 border-2 rounded-lg py-2 px-3 focus:outline-none focus:border-blue-400 w-full "
                name="school"
                value={userProfileData.school}
                onChange={handleInputChange}
              />
            </div>

            {/* ------- home alone--------------- */}
            <div className="flex flex-col mt-3">
              <label htmlFor="">
                Do you allow your child/young person home alone travel? *
              </label>
              <input
                type="text"
                className="border-gray-300 border-2 rounded-lg py-2 px-3 focus:outline-none focus:border-blue-400 w-full "
                name="homeAlone"
                value={userProfileData.homeAlone}
                onChange={handleInputChange}
              />
            </div>
            {/* -----------whatsapp----------- */}
            <div className="flex flex-col mt-3">
              <label htmlFor="">
                Would you like to be part of Girls United London Whatsapp? *
              </label>
              <select
                type="text"
                className=" border-gray-300 border-2 rounded-lg py-2 px-3 focus:outline-none focus:border-blue-400 w-full "
                name="whatsapp"
                value={userProfileData.whatsapp}
                onChange={handleInputChange}
              >
                <option value=""></option>
                <option value="Yes">Yes</option>
                <option value="No">No</option>
                <option value="Already part of it">Already part of it</option>
              </select>
            </div>
            {/* -------ethnic background------------- */}
            <div className="flex flex-col mt-3">
              <label htmlFor="">
                Please select the option that best describes the child's ethnic
                background: *
              </label>
              <select
                type="text"
                className=" border-gray-300 border-2 rounded-lg py-2 px-3 focus:outline-none focus:border-blue-400 w-full "
                name="ethnicBackground"
                value={userProfileData.ethnicBackground}
                onChange={handleInputChange}
              >
                <option value=""></option>
                <option value="Asian / Asian British-Indian">
                  Asian / Asian British-Indian
                </option>
                <option value="Asian / Asian British-Pakistani">
                  Asian / Asian British-Pakistani
                </option>
                <option value="Asian / Asian British-Bangladeshi">
                  Asian / Asian British-Bangladeshi
                </option>
                <option value="Asian / Asian British-Chinese">
                  Asian / Asian British-Chinese
                </option>
                <option value="Arab">Arab</option>
                <option value="Black-African">Black-African</option>
                <option value="Black-Caribbean">Black-Caribbean</option>
                <option value="Black-British">Black-British</option>
                <option value="Mixed-White and Black Caribbean">
                  Mixed-White and Black Caribbean
                </option>
                <option value="Mixed-White and Black African">
                  Mixed-White and Black African
                </option>
                <option value="Mixed-White and Asian">
                  Mixed-White and Asian
                </option>
                <option value="White-English / Welsh / Scottish / Northern Irish / British">
                  White-English / Welsh / Scottish / Northern Irish / British
                </option>
                <option value="White-Irish">White-Irish</option>
                <option value="White-Gypsy or Irish Traveller">
                  White-Gypsy or Irish Traveller
                </option>
                <option value="Any other White">Any other White</option>
                <option value="Any other ethnic group">
                  Any other ethnic group
                </option>
                <option value="Any other black, African and Caribbean">
                  Any other black, African and Caribbean
                </option>
                <option value="Any other Aisan">Any other Aisan</option>
                <option value="Prefer not to say">Prefer not to say</option>
              </select>
            </div>
            <hr className="my-5" />
            {/* ----------Guardian Information--------- */}
            <div>
              <h1 className="text-[23px] font-semibold">
                Next of Kin / Parent / Guardian Information
              </h1>
              <div className="grid-item my-4">
                <input
                  type="text"
                  className=" border-gray-300 border-2 rounded-lg py-2 px-3 focus:outline-none focus:border-blue-400 w-full "
                  placeholder="Full Name"
                  name="guardianName"
                  value={userProfileData.guardianName}
                  onChange={handleInputChange}
                />
                <input
                  type="text"
                  className=" border-gray-300 border-2 rounded-lg py-2 px-3 focus:outline-none focus:border-blue-400 w-full "
                  placeholder="Email"
                  name="guardianEmail"
                  value={userProfileData.guardianEmail}
                  onChange={handleInputChange}
                />
                <input
                  type="text"
                  className=" border-gray-300 border-2 rounded-lg py-2 px-3 focus:outline-none focus:border-blue-400 w-full "
                  placeholder="Mobile"
                  name="guardianMobile"
                  value={userProfileData.guardianMobile}
                  onChange={handleInputChange}
                />
                <input
                  type="text"
                  className="border-gray-300 border-2 rounded-lg py-2 px-3 focus:outline-none focus:border-blue-400 w-full "
                  placeholder="Relation to Player"
                  name="guardianRelation"
                  value={userProfileData.guardianRelation}
                  onChange={handleInputChange}
                />
                <input
                  type="text"
                  className=" border-gray-300 border-2 rounded-lg py-2 px-3 focus:outline-none focus:border-blue-400 w-full "
                  placeholder="Contact 2 Name"
                  name="contact2Name"
                  value={userProfileData.contact2Name}
                  onChange={handleInputChange}
                />
                <input
                  type="text"
                  className=" border-gray-300 border-2 rounded-lg py-2 px-3 focus:outline-none focus:border-blue-400 w-full "
                  placeholder="Contact 2 Email"
                  name="contact2Email"
                  value={userProfileData.contact2Email}
                  onChange={handleInputChange}
                />
                <input
                  type="text"
                  className=" border-gray-300 border-2 rounded-lg py-2 px-3 focus:outline-none focus:border-blue-400 w-full "
                  placeholder="Contact 2 Mobile"
                  name="contact2Mobile"
                  value={userProfileData.contact2Mobile}
                  onChange={handleInputChange}
                />
                <input
                  type="text"
                  onChange={handleInputChange}
                  name="contact2Relation"
                  value={userProfileData.contact2Relation}
                  className=" border-gray-300 border-2 rounded-lg py-2 px-3 focus:outline-none focus:border-blue-400 w-full "
                  placeholder="Contact 2 Relationship"
                />
              </div>
            </div>
            <hr className="my-5" />
            {/* ----------------MEDICAL INFO------------ */}
            <div>
              <h1 className="text-[23px] font-semibold mb-6">
                Medical Information
              </h1>
              <p>
                Any injuries, allergies, disabilities, illnesses or relevant
                health concerns your coaches should know about?
              </p>
              <textarea
                className="w-full  h-52 border-gray-300 border-2 rounded-lg py-2 px-3 focus:outline-none focus:border-blue-400 mt-2 "
                name="healthNotes"
                style={{ minHeight: "calc(1.5em + .75rem + 2px)" }}
                onChange={handleInputChange}
                value={userProfileData.healthNotes}
                placeholder="Enter your Notes here..."
              ></textarea>
            </div>

            {/* Submit Button */}
            <div className="py-3 mt-2 w-[40%] mx-auto">
              <button
                type="submit"
                className="bg-[#EC7CD3] text-white w-[100%] mx-auto rounded-lg py-3"
                disabled={loading}
              >
                {loading ? "Processing..." : "SUBMIT"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PlayerProfile;
