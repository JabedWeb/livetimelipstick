'use client'

import React, { useState } from 'react';

export const Otp = () => {
  const [otp, setOtp] = useState(["", "", "", "","",""]);

  const handleChange = (e, index) => {
    const value = e.target.value;
    if (!isNaN(value) && value.length === 1) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);
      // Move to next input automatically
      if (index < 5 && value) {
        const nextInput = document.getElementById(`otp${index + 1}`);
        if (nextInput) {
          nextInput.focus();
        }

    }
  }
}

  return (
    <div className='md:flex items-center'>
      {/* Left side image */}
      <div className='md:w-1/2'>
        <img className='w-full' src="/login.png" alt="login page" />
      </div>
      
      {/* Right side form */}
      <div className='md:w-1/2 p-4'>
        <h1 className='text-3xl font-semibold mb-2'>Enter OTP</h1>
        <p className="text-gray-500 mb-4">
          We have shared a code to your registered email address
          <br />
          jabed@example.com
        </p>

        {/* OTP Input Fields */}
        <form>
          <div className='flex justify-between mb-4'>
            {otp.map((data, index) => (
              <input
                key={index}
                id={`otp${index}`}
                type="text"
                value={otp[index]}
                maxLength={1}
                onChange={(e) => handleChange(e, index)}
                className="w-12 h-12 text-center text-2xl border-2 rounded-md  focus:border-black"
              />
            ))}
          </div>
          <input
            className='w-full cursor-pointer bg-black text-white py-3 px-2 rounded-md font-semibold mt-2'
            type="submit"
            value="Verify"
          />
        </form>
      </div>
    </div>
  );
};
