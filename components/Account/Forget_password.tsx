import React from 'react'

const Forget_password = () => {
  return (
   <div className='md:flex  items-center'>
        <div className='md:w-1/2'>
          <img className='w-full' src="/login.png" alt="login page" />
        </div>
        <div className='md:w-1/2 p-4'>
            <a className='mb-4 block' href='#'> Back</a>
          <h1 className='text-3xl font-semibold '>Forgot Password </h1>
          <p>Enter your registered email address. we’ll send you a code to reset your password.</p>
          <form>
            <div className='my-4'>
              <label>Email Address </label> <br />
            <input placeholder='jabed@example.com' className='w-full rounded-md py-3 px-2 border-2 border-black' type="Email" />
            </div>
            <input className='w-full cursor-pointer bg-black text-white py-3 px-2 rounded-md font-semibold mt-2' type="submit" value="Send OTP"/>
            
          </form>
        </div>
    </div>
  )
}

export default Forget_password