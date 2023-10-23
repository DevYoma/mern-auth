import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { signInFailure, signInStart, signInSuccess } from "../redux/user/userSlice";
import { useDispatch, useSelector } from 'react-redux';

const SignIn = () => {

  // @ts-ignore
  const { loading, error } = useSelector((state) => state.user);
  // console.log(loading, error);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState<any>({
    email: '', 
    password: ''
  })  

  const handleChange = (e: any) => {
    setFormData({ 
      ...formData, 
      [e.target.name]: e.target.value
    })
  }

  // console.log(formData);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    // console.log(formData);

    try {
      dispatch(signInStart());
   
      const response: Response = await fetch('/api/auth/signin', {
        method: 'POST', 
        headers: {
          'Content-Type': 'application/json'
        }, 
        body: JSON.stringify(formData)
      });
  
      const data = await response.json();
      console.log(data);
      
      if(data?.success === false){
        dispatch(signInFailure(data.message))
        return
      }
      
      dispatch(signInSuccess(data));
      navigate('/')
    } catch (error) {
      dispatch(signInFailure(error))
    }
  }

  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-3xl text-center font-semibold my-7">Sign In</h1>

      <form 
        className="flex flex-col gap-4"
        onSubmit={handleSubmit}
      >
        <input 
          type="email" 
          placeholder="Email"
          name="email"
          className="bg-slate-100 p-3 rounded-lg"
          value={formData.email}
          onChange={handleChange}
          required
        />
        <input 
          type="password" 
          placeholder="Password"
          name="password"
          className="bg-slate-100 p-3 rounded-lg"
          value={formData.password}
          onChange={handleChange}
          required
        />

        <button 
          disabled={loading}
          className="bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95"
        >
          {loading ? 'Loading...' : 'Sign In'}
        </button>
      </form>

      <div className="flex gap-2 mt-5">
        <p>Don't have an account? </p>
        <Link to={'/sign-up'}>
          <span className="text-blue-500">Sign Up</span>
        </Link>
      </div>
      <p className="text-red-700 mt-5">{error ? error || "Something went wrong!" : ''}</p>
    </div>
  )
}

export default SignIn