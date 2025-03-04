import React from 'react'

const Register = () => {
  return (
 <div className='md:flex  items-center'>
        <div className='md:w-1/2'>
          <img className='w-full' src="/register.png" alt="login page" />
        </div>
        <div className='md:w-1/2 p-4'>
          <h1 className='text-3xl font-semibold'>Create New Account </h1>
          <p>Please enter details</p>
          <form>
             <div className='my-4'>
              <label>First Name</label> <br />
            <input placeholder='jabed' className='w-full rounded-md py-3 px-2 border-2 border-black' type="text" />
            </div>
             <div className='my-4'>
              <label>Last Name </label> <br />
            <input placeholder='hossen' className='w-full rounded-md py-3 px-2 border-2 border-black' type="text" />
            </div>
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
                <label className='ml-2'>I agree to the <a className='font-semibold' href='#'>Terms and condition</a></label>
              </div>
            </div>
            <input className='w-full cursor-pointer bg-black text-white py-3 px-2 rounded-md font-semibold mt-2' type="submit" value="Signup"/>
            
          </form>

          <div className='mt-2'>
            <p>Already Register ?  <a className='font-semibold' href="#">Login</a></p>
          </ div>
        </div>
    </div>
  )
}

export default Register