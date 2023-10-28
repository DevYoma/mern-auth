import { useSelector } from "react-redux";
import { useRef, useState, useEffect } from "react";
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage'
import { app } from "../firebase";
import { useDispatch } from "react-redux";
import { updateUserStart, updateUserSuccess, updateUserFailure } from "../redux/user/userSlice";

const Profile = () => {
  const dispatch = useDispatch();
  const fileRef = useRef(null);
  const [image, setImage] = useState(undefined);
  const [imagePercent, setImagePercent] = useState(0);
  const [imageError, setImageError] = useState(false);
  const [formData, setFormData] = useState({});
  const [updateSuccess, setUpdateSuccess] = useState(false);
  // console.log(formData);

  // @ts-ignore 
  const {currentUser, loading, error} = useSelector(state => state.user);
  
  useEffect(() => {
    if(image){
      handleFileUpload(image);
    }
  }, [image]);
  
  const handleFileUpload = async (image: any) => {
    // console.log(image);
    const storage = getStorage(app)

    const fileName = new Date().getTime() + image.name;
    const storageRef = ref(storage, fileName);

    const uploadTask = uploadBytesResumable(storageRef, image);

    uploadTask.on(
      'state_changed', 
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        // console.log('Upload is ' + progress + '% done');
        setImagePercent(Math.round(progress));
      },
      (error) => {
        setImageError(true)
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadUrl) => {
          setFormData({
            ...formData, 
            profilePicture: downloadUrl
          })
        })
      }
    )
  }

  const handleChange = (e: any) => {
    setFormData({
      ...formData, 
      [e.target.id]: e.target.value
    })
  } 

  // console.log(formData);

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    try {
      dispatch(updateUserStart())
      const response = await fetch(`/api/user/update/${currentUser._id}`, {
        method: 'POST', 
        headers: {
          'Content-Type': 'application/json'
        }, 
        body: JSON.stringify(formData)
      });

      const data = await response.json();
      if(data.success === false){
        dispatch(updateUserFailure(data.message))
      }

      dispatch(updateUserSuccess(data))
      setUpdateSuccess(true)
    } catch (error) {
      dispatch(updateUserFailure(error))
    }
  }

  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-3xl font-semibold text-center my-7">Profile</h1>
      
      <form 
        onSubmit={handleSubmit}
        className="flex flex-col gap-4"
      >
        <input 
          type="file" 
          ref={fileRef} 
          hidden 
          accept="image/*"
          onChange={(e: any) => setImage(e.target.files[0])}
        />
        <img 
        // @ts-ignore
          src={formData?.profilePicture || currentUser.profilePicture} 
          alt="profile" 
          className="mt-2 h-24 w-24 self-center cursor-pointer rounded-full object-cover"  
          // @ts-ignore
          onClick={() => fileRef.current.click()}
        />

        {/* image upload progress */}
        <p className="text-sm self-center">
        {imageError 
          ? 
          (
            <span className="text-red-700">Error uploading image(file size should be less than 2MB)</span>
          ) 
          : imagePercent > 0 && imagePercent < 100 
          ? 
          (
            <span className="text-slate-700">{`Uploading: ${imagePercent}%`}</span>
          )
          : imagePercent === 100 
          ?
          (
            <span className="text-green-700">Image uploaded successfully</span>
          ) : ''
        }
        </p>

        <input 
          defaultValue={currentUser.username}
          type="text" 
          id="username"
          placeholder="Username"
          className="bg-slate-100 rounded-lg p-3"
          onChange={handleChange}
        />
        <input 
          defaultValue={currentUser.email}
          type="email" 
          id="email"
          placeholder="Email"
          className="bg-slate-100 rounded-lg p-3"
          onChange={handleChange}
        />
        <input 
          type="password" 
          id="password"
          placeholder="Password"
          className="bg-slate-100 rounded-lg p-3"
          onChange={handleChange}
        />

        <button
          className="bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-80 cursor-pointer"
        >
          {loading ? 'loading' : 'Update'}
        </button>
      </form> 

      <div className="flex justify-between mt-5">
        <span className="text-red-700 cursor-pointer">Delete Account</span>
        <span className="text-red-700 cursor-pointer">Sign Out</span>
      </div>
      <p className="text-red-700 mt-5">{error && "Something went wrong!"}</p>
      <p className="text-green-700 mt-5">{updateSuccess && "User updated successfully!"}</p>
    </div>

  )
}

export default Profile