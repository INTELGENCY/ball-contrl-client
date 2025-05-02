import React, { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { FiUpload } from "react-icons/fi";
import {
  getDownloadURL,
  ref,
  uploadBytesResumable,
  getStorage,
} from "firebase/storage";
import { app } from "../../../../firebase";
import { useSelector } from "react-redux";
import { SyncLoader } from "react-spinners";
import { ClipLoader } from "react-spinners";

const PlayerProfile = () => {
  const { currentUser } = useSelector((state) => state.user);
  const [userProfileData, setUserProfileData] = useState({
    profilePicture: null,
    username: "",
    dob: "",
    home: "",
    address_line_1: "",
    address_line_2: "",
    postcode: "",
    phoneNumber: "",
    city: "",
    country: "",
    hearAbout: "",
    school: "",
    homeAlone: "",
    whatsapp: "",
    ethnicBackground: "",
    guardianName: "",
    guardianEmail: "",
    guardianMobile: "",
    guardianRelation: "",
    contact2Name: "",
    contact2Email: "",
    contact2Mobile: "",
    contact2Relation: "",
    healthNotes: "",
    playerId: currentUser ? currentUser._id : "",
  });

  const length = Object.values(userProfileData);

  const [imageName, setImageName] = useState("");
  const [imageUploadProgress, setImageUploadProgress] = useState(null);
  const [imageUploadError, setImageUploadError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState({});

  console.log("this is data", userProfileData);

  // useEffect(() => {
  //   const fetchProfile = async () => {
  //     try {
  //       setLoading(true);
  //       const response = await fetch(
  //         `/api/player/profile/${sessionData.playerId}`
  //       );
  //       if (response.ok) {
  //         const data = await response.json();
  //         setUserProfileData((prevState) => ({
  //           ...prevState,
  //           profilePicture: data.profilePicture,
  //           username: data.username,
  //           email: data.email,
  //           phoneNumber: data.phoneNumber,
  //           school: data.school,
  //           whatsapp: data.whatsapp,
  //           dob: data.dob,
  //           home: data.home,
  //           city: data.city,
  //           country: data.country,
  //           postcode: data.postcode,
  //           address_line_1: data.address_line_1,
  //           address_line_2: data.address_line_2,
  //           contact2Email: data.contact2Email,
  //           contact2Name: data.contact2Name,
  //           contact2Relation: data.contact2Relation,
  //           contact2Mobile: data.contact2Mobile,
  //           ethnicBackground: data.ethnicBackground,
  //           guardianEmail: data.guardianEmail,
  //           guardianMobile: data.guardianMobile,
  //           guardianName: data.guardianName,
  //           guardianRelation: data.guardianRelation,
  //           healthNotes: data.healthNotes,
  //           hearAbout: data.hearAbout,
  //           homeAlone: data.homeAlone,
  //         }));
  //       } else {
  //         toast.error("Failed to fetch profile data");
  //       }
  //     } catch (error) {
  //       toast.error("Error fetching profile data");
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   if (currentUser) {
  //     fetchProfile();
  //   } else {
  //     setUserProfileData({
  //       profilePicture: null,
  //       username: "",
  //       email: "",
  //     });
  //   }
  // }, [currentUser, sessionData.playerId]);

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
    setImageName(file.name);
    uploadImageToFirebase(file);
  };

  const uploadImageToFirebase = (file) => {
    const storage = getStorage(app);
    const fileName = new Date().getTime() + "-" + file.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setImageUploadProgress(progress.toFixed(0));
      },
      (error) => {
        setImageUploadError("Image upload failed");
        setImageUploadProgress(null);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setUserProfileData((prevState) => ({
            ...prevState,
            profilePicture: downloadURL,
          }));
          setImageUploadProgress(null);
          setImageUploadError(null);
        });
      }
    );
  };

  const handleSessionSubmit = async (e) => {
    e.preventDefault();
    // if (!validateForm()) return;

    try {
      const response = await fetch(
        `${import.meta.env.VITE_BASE_URL}/player/profile/update/${
          currentUser?._id
        }`,
        {
          method: "PUT",
          body: JSON.stringify(userProfileData),
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        toast.success("Profile updated successfully");
      } else {
        toast.error("Failed to update profile");
      }
    } catch (error) {
      toast.error("Profile update failed");
    }
  };

  // if (!currentUser) {
  //   return (
  //     <div className="flex items-center justify-center text-center h-[80vh]">
  //       Please sign in to access this page.
  //     </div>
  //   );
  // }

  // if (loading) {
  //   return (
  //     <div className="flex justify-center items-center h-screen">
  //       <ClipLoader color="#fd86c8" />
  //     </div>
  //   );
  // }

  return (
    <div className="w-[100%] mx-auto ">
      <div className="pt-10">
        <h1 className="text-4xl text-gray-800 font-semibold text-center  mb-8">
          {" "}
          Parent Profile
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
                {imageName && <p className="mt-2 text-sm">{imageName}</p>}
                <input
                  type="file"
                  name="profilePicture"
                  width={100}
                  height={100}
                  onChange={handleImageChange}
                  accept="image/*"
                  id="fileId"
                />
                {imageUploadProgress && (
                  <p>Upload progress: {imageUploadProgress}%</p>
                )}
                {imageUploadError && (
                  <p className="text-red-500">{imageUploadError}</p>
                )}
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
                {/* {errors.phoneNumber && (
                  <p className="text-red-300 text-sm mt-1">
                    {errors.phoneNumber}
                  </p>
                )} */}
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
                {errors.address_line_2 && (
                  <p className="text-red-300 text-sm mt-1">
                    {errors.address_line_2}
                  </p>
                )}
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
                {/* {errors.dob && (
                  <p className="text-red-300 text-sm mt-1">{errors.dob}</p>
                )} */}
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
            {/*  */}

            {/* Submit Button */}
            <div className="py-3 mt-2 w-[40%] mx-auto">
              <button
                type="submit"
                className="bg-[#EC7CD3]  text-white w-[100%] mx-auto  rounded-lg py-3"
              >
                SUBMIT
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PlayerProfile;
