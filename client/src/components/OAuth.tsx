import { GoogleAuthProvider, signInWithPopup, getAuth } from '@firebase/auth'
import { app } from '../firebase';
import { useDispatch } from 'react-redux';
import { signInSuccess } from '../redux/user/userSlice';
import { useNavigate } from 'react-router-dom';

const OAuth = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const handleGoogleClick = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const auth = getAuth(app);
      const result = await signInWithPopup(auth, provider)
      // console.log(result);

      const response = await fetch('/api/auth/google', {
        method: 'POST', 
        headers: {
          'Content-Type': 'application/json'
        }, 
        body: JSON.stringify({
          name: result.user.displayName, 
          email: result.user.email, 
          photo: result.user.photoURL
        })
      })
      
      const data = await response.json();
      console.log(data);
      dispatch(signInSuccess(data));

      navigate('/')

    } catch (error) {
      console.log("Could not login with google", error);
    }
  }
  return (
    <button 
      onClick={handleGoogleClick}
      type="button" // changes the default type(submit) behavior and does not submit the form.
      className="bg-red-700 text-white rounded-lg p-3 uppercase hover:opacity-95"
    >
      Continue with google
    </button>
  )
}

export default OAuth