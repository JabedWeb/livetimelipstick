import React from 'react'
import Image from 'next/image'

const Login = () => {
  return (
    <div className='md:flex  items-center'>
        <div className='md:w-1/2'>
          <img className='w-full' src="/login.png" alt="login page" />
        </div>
        <div className='md:w-1/2 p-4'>
          <h1 className='text-3xl font-semibold'>Welcome 👋 </h1>
          <p>Please login here</p>
          <form>
            <div className='my-4'>
              <label>Email Address </label> <br />
            <input placeholder='jabed@example.com' className='w-full rounded-md py-3 px-2 border-2 border-black' type="Email" />
            </div>
            <div>
               <label>Password </label> <br />
              <input className='w-full rounded-md py-3 px-2 border-2 border-black' type="password" />
            </div>
            <div className='flex justify-between items-center mt-2'>
              <div>
                <input className='scale-150' type="checkbox" defaultChecked />
                <label className='ml-2'>Remember me</label>
              </div>
              <div>
                <a href="#">Forget password?</a>
              </div>
              
              
            </div>
            <input className='w-full cursor-pointer bg-black text-white py-3 px-2 rounded-md font-semibold mt-2' type="submit" value="Login"/>
            
          </form>

          <div className='mt-2'>
            <p>Don&apos;t have an account? <a className='font-semibold' href="#">Sign up</a></p>
          </ div>
        </div>
    </div>
  )
}

export default Login